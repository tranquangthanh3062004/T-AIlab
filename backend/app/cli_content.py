"""
CHINAI AI Learning OS — Content Governance & Data Pipeline CLI (Phase 6)
========================================================================
Supports all 7 required governance commands:
  1. python -m app.cli_content content:validate
  2. python -m app.cli_content content:report
  3. python -m app.cli_content resources:check
  4. python -m app.cli_content content:import --dry-run
  5. python -m app.cli_content content:import
  6. python -m app.cli_content content:publish
  7. python -m app.cli_content content:rollback
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.services.curriculum import get_tracks
from app.services.curriculum_governance import (
    VERIFIED_OER_REGISTRY,
    validate_curriculum_prerequisite_dag,
)

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
BACKUPS_DIR = DATA_DIR / "backups"
MANIFEST_PATH = DATA_DIR / "published_manifest.json"


def _ensure_dirs() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    BACKUPS_DIR.mkdir(parents=True, exist_ok=True)


def run_content_validate() -> dict[str, Any]:
    """Validates both VI and EN 15-track curricula, DAG acyclicity, and AST code exercises."""
    tracks_vi = get_tracks("vi")
    tracks_en = get_tracks("en")
    dag_vi = validate_curriculum_prerequisite_dag(tracks_vi)
    dag_en = validate_curriculum_prerequisite_dag(tracks_en)

    vi_ids = [t.id for t in tracks_vi]
    en_ids = [t.id for t in tracks_en]
    bilingual_parity = vi_ids == en_ids and dag_vi["total_lessons"] == dag_en["total_lessons"]

    passed = (
        dag_vi["all_lessons_passed_rubric"]
        and dag_en["all_lessons_passed_rubric"]
        and bilingual_parity
    )

    return {
        "command": "content:validate",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "PASSED" if passed else "FAILED",
        "bilingual_track_parity": bilingual_parity,
        "vi_validation": {
            "total_tracks": dag_vi["total_tracks"],
            "total_lessons": dag_vi["total_lessons"],
            "all_lessons_passed_rubric": dag_vi["all_lessons_passed_rubric"],
            "average_rubric_score": dag_vi["average_rubric_score"],
            "dag_cycles": dag_vi["dag_cycles"],
            "missing_prerequisites": dag_vi["missing_prerequisites"],
        },
        "en_validation": {
            "total_tracks": dag_en["total_tracks"],
            "total_lessons": dag_en["total_lessons"],
            "all_lessons_passed_rubric": dag_en["all_lessons_passed_rubric"],
            "average_rubric_score": dag_en["average_rubric_score"],
            "dag_cycles": dag_en["dag_cycles"],
            "missing_prerequisites": dag_en["missing_prerequisites"],
        },
    }


def run_resources_check() -> dict[str, Any]:
    """Audits all 21 OER sources for valid canonical URLs, SPDX licenses, and access models."""
    invalid_resources: list[str] = []
    by_access_model: dict[str, int] = {}
    by_type: dict[str, int] = {}

    for res in VERIFIED_OER_REGISTRY:
        if not res.canonical_url.startswith("https://"):
            invalid_resources.append(f"{res.id}: non-HTTPS URL {res.canonical_url}")
        if not res.spdx_license:
            invalid_resources.append(f"{res.id}: missing SPDX license")
        by_access_model[res.access_model] = by_access_model.get(res.access_model, 0) + 1
        by_type[res.resource_type] = by_type.get(res.resource_type, 0) + 1

    return {
        "command": "resources:check",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "HEALTHY" if not invalid_resources else "DEGRADED",
        "total_verified_resources": len(VERIFIED_OER_REGISTRY),
        "access_model_breakdown": by_access_model,
        "resource_type_breakdown": by_type,
        "invalid_resources": invalid_resources,
    }


def run_content_report() -> dict[str, Any]:
    """Generates a full curriculum inventory and quality report across all 15 tracks."""
    tracks_vi = get_tracks("vi")
    dag_vi = validate_curriculum_prerequisite_dag(tracks_vi)
    res_check = run_resources_check()

    track_summaries = []
    for tr in tracks_vi:
        lessons = [lsn for mod in tr.modules for lsn in mod.lessons]
        track_summaries.append({
            "track_number": tr.track_number,
            "track_id": tr.id,
            "title": tr.title,
            "target_audience": tr.target_audience,
            "specialization_branch": tr.specialization_branch,
            "prerequisites": tr.prerequisites,
            "modules_count": len(tr.modules),
            "lessons_count": len(lessons),
            "datasets": [lsn.real_dataset.name for lsn in lessons if lsn.real_dataset],
            "has_flashcards": all(len(lsn.flashcards) >= 3 for lsn in lessons),
            "has_output_analysis": all(bool(lsn.output_analysis) for lsn in lessons),
        })

    return {
        "command": "content:report",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "pipeline_stages": dag_vi["pipeline_stages"],
        "total_tracks": dag_vi["total_tracks"],
        "total_lessons": dag_vi["total_lessons"],
        "average_rubric_score": dag_vi["average_rubric_score"],
        "all_lessons_passed_rubric": dag_vi["all_lessons_passed_rubric"],
        "oer_registry_count": res_check["total_verified_resources"],
        "tracks": track_summaries,
    }


def run_content_import(dry_run: bool = False) -> dict[str, Any]:
    """
    Executes the 13-stage Content Ingestion Pipeline.
    When dry_run=False, writes a versioned backup snapshot to backend/data/backups/
    and updates backend/data/published_manifest.json while preserving UserProgress.
    """
    _ensure_dirs()
    validation = run_content_validate()
    res_check = run_resources_check()

    if validation["status"] != "PASSED" or res_check["status"] != "HEALTHY":
        return {
            "command": "content:import",
            "dry_run": dry_run,
            "status": "ABORTED_BY_QUALITY_GATE",
            "validation": validation,
            "resources": res_check,
        }

    tracks_vi = get_tracks("vi")
    manifest_payload = {
        "schema_version": "2.2.0",
        "published_at": datetime.now(timezone.utc).isoformat(),
        "total_tracks": len(tracks_vi),
        "total_lessons": validation["vi_validation"]["total_lessons"],
        "total_oer_resources": res_check["total_verified_resources"],
        "average_rubric_score": validation["vi_validation"]["average_rubric_score"],
        "tracks": [t.model_dump() for t in tracks_vi],
        "oer_resources": [r.model_dump() for r in VERIFIED_OER_REGISTRY],
    }

    backup_file_str = None
    if not dry_run:
        ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        backup_path = BACKUPS_DIR / f"curriculum_snapshot_{ts}.json"
        if MANIFEST_PATH.exists():
            backup_path.write_text(MANIFEST_PATH.read_text(encoding="utf-8"), encoding="utf-8")
        else:
            backup_path.write_text(json.dumps(manifest_payload, ensure_ascii=False, indent=2), encoding="utf-8")
        MANIFEST_PATH.write_text(json.dumps(manifest_payload, ensure_ascii=False, indent=2), encoding="utf-8")
        backup_file_str = str(backup_path.name)

    return {
        "command": "content:import",
        "dry_run": dry_run,
        "status": "DRY_RUN_READY" if dry_run else "IMPORTED_AND_SNAPSHOT_SAVED",
        "user_progress_preserved": True,
        "snapshot_file": backup_file_str,
        "total_tracks": len(tracks_vi),
        "total_lessons": validation["vi_validation"]["total_lessons"],
        "total_oer_resources": res_check["total_verified_resources"],
    }


def run_content_publish() -> dict[str, Any]:
    """Publishes the validated 15-track curriculum and writes published_manifest.json."""
    result = run_content_import(dry_run=False)
    result["command"] = "content:publish"
    if result["status"] == "IMPORTED_AND_SNAPSHOT_SAVED":
        result["status"] = "PUBLISHED"
    return result


def run_content_rollback() -> dict[str, Any]:
    """
    Restores the latest curriculum snapshot from backend/data/backups/
    without touching or deleting any learner progress records in SQLite.
    """
    _ensure_dirs()
    snapshots = sorted(BACKUPS_DIR.glob("curriculum_snapshot_*.json"), reverse=True)
    if not snapshots:
        # Create an initial baseline snapshot so rollback is always idempotent
        run_content_import(dry_run=False)
        snapshots = sorted(BACKUPS_DIR.glob("curriculum_snapshot_*.json"), reverse=True)

    latest_snapshot = snapshots[0]
    MANIFEST_PATH.write_text(latest_snapshot.read_text(encoding="utf-8"), encoding="utf-8")
    data = json.loads(latest_snapshot.read_text(encoding="utf-8"))

    return {
        "command": "content:rollback",
        "status": "ROLLED_BACK_SUCCESSFULLY",
        "restored_from_snapshot": latest_snapshot.name,
        "user_progress_preserved": True,
        "total_tracks": data.get("total_tracks", 15),
        "total_lessons": data.get("total_lessons", 15),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="chinai-content-cli",
        description="CHINAI AI Learning OS — Content Governance & Data Pipeline CLI",
    )
    parser.add_argument(
        "command",
        choices=[
            "content:validate",
            "content:report",
            "resources:check",
            "content:import",
            "content:publish",
            "content:rollback",
        ],
        help="Governance pipeline command to execute",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run pipeline validation and schema checks without writing to disk",
    )
    args = parser.parse_args(argv)

    if args.command == "content:validate":
        res = run_content_validate()
    elif args.command == "resources:check":
        res = run_resources_check()
    elif args.command == "content:report":
        res = run_content_report()
    elif args.command == "content:import":
        res = run_content_import(dry_run=args.dry_run)
    elif args.command == "content:publish":
        res = run_content_publish()
    elif args.command == "content:rollback":
        res = run_content_rollback()
    else:
        res = {"status": "UNKNOWN_COMMAND"}

    print(json.dumps(res, indent=2, ensure_ascii=False))
    return 0 if res.get("status") not in ("FAILED", "ABORTED_BY_QUALITY_GATE") else 1


if __name__ == "__main__":
    sys.exit(main())
