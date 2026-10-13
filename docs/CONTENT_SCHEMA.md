# CHINAI AI Learning OS — Content Schema & JSON Specifications

## 1. JSON Schema for Lesson Payloads

Below is the formal JSON Schema specification for validating lesson objects imported or published into CHINAI AI Learning OS:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "LessonSchema",
  "type": "object",
  "required": [
    "id",
    "module_id",
    "track_id",
    "title",
    "target_audience",
    "estimated_minutes",
    "difficulty",
    "objectives",
    "why_this_matters",
    "intuitive_explanation",
    "formal_explanation",
    "output_analysis",
    "common_misconceptions",
    "when_to_use_and_not_use",
    "quiz",
    "flashcards",
    "mastery_criteria",
    "source_references",
    "license_provenance",
    "summary"
  ],
  "properties": {
    "id": { "type": "string", "pattern": "^lesson-[a-z0-9-]+$" },
    "module_id": { "type": "string" },
    "track_id": { "type": "string" },
    "title": { "type": "string", "minLength": 5 },
    "target_audience": { "type": "string", "enum": ["beginner", "engineer"] },
    "estimated_minutes": { "type": "integer", "minimum": 5, "maximum": 90 },
    "difficulty": { "type": "string", "enum": ["Beginner", "Intermediate", "Advanced", "Research/Expert"] },
    "prerequisites": { "type": "array", "items": { "type": "string" } },
    "objectives": { "type": "array", "minItems": 3, "items": { "type": "string" } },
    "why_this_matters": { "type": "string", "minLength": 20 },
    "intuitive_explanation": { "type": "string", "minLength": 50 },
    "formal_explanation": { "type": "string", "minLength": 30 },
    "formula_guide": {
      "type": ["object", "null"],
      "properties": {
        "title": { "type": "string" },
        "latex_expression": { "type": "string" },
        "plain_english": { "type": "string" },
        "symbols": {
          "type": "array",
          "minItems": 2,
          "items": {
            "type": "object",
            "required": ["symbol", "name", "meaning", "sample_value"],
            "properties": {
              "symbol": { "type": "string" },
              "name": { "type": "string" },
              "meaning": { "type": "string" },
              "sample_value": { "type": "string" }
            }
          }
        },
        "steps": {
          "type": "array",
          "minItems": 2,
          "items": {
            "type": "object",
            "required": ["step_number", "title", "calculation", "result_meaning"],
            "properties": {
              "step_number": { "type": "integer" },
              "title": { "type": "string" },
              "calculation": { "type": "string" },
              "result_meaning": { "type": "string" }
            }
          }
        }
      }
    },
    "real_dataset": {
      "type": ["object", "null"],
      "properties": {
        "name": { "type": "string" },
        "source_org": { "type": "string" },
        "source_url": { "type": "string", "format": "uri" },
        "license": { "type": "string" },
        "description": { "type": "string" },
        "columns": { "type": "array", "items": { "type": "string" } },
        "sample_rows": { "type": "array", "items": { "type": "object" } }
      }
    },
    "worked_example_code": { "type": ["string", "null"] },
    "output_analysis": { "type": "string" },
    "common_misconceptions": { "type": "array", "minItems": 2, "items": { "type": "string" } },
    "when_to_use_and_not_use": { "type": "array", "minItems": 2, "items": { "type": "string" } },
    "guided_practice": { "type": "array", "items": { "type": "string" } },
    "code_exercise": {
      "type": ["object", "null"],
      "properties": {
        "id": { "type": "string" },
        "instructions": { "type": "string" },
        "starter_code": { "type": "string" },
        "solution_code": { "type": "string" },
        "test_assertions_code": { "type": "string" }
      }
    },
    "flashcards": {
      "type": "array",
      "minItems": 2,
      "items": {
        "type": "object",
        "required": ["question", "answer"],
        "properties": {
          "question": { "type": "string" },
          "answer": { "type": "string" }
        }
      }
    },
    "quiz": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "question", "options"],
        "properties": {
          "id": { "type": "string" },
          "question": { "type": "string" },
          "options": {
            "type": "array",
            "minItems": 2,
            "items": {
              "type": "object",
              "required": ["id", "text", "is_correct", "explanation"],
              "properties": {
                "id": { "type": "string" },
                "text": { "type": "string" },
                "is_correct": { "type": "boolean" },
                "explanation": { "type": "string" }
              }
            }
          }
        }
      }
    },
    "mastery_criteria": { "type": "array", "minItems": 2, "items": { "type": "string" } },
    "source_references": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["title", "organization", "url", "resource_type", "license", "lifecycle_status"],
        "properties": {
          "title": { "type": "string" },
          "organization": { "type": "string" },
          "url": { "type": "string", "format": "uri" },
          "resource_type": { "type": "string" },
          "license": { "type": "string" },
          "lifecycle_status": { "type": "string" }
        }
      }
    },
    "license_provenance": { "type": "string", "minLength": 10 },
    "summary": { "type": "string", "minLength": 20 }
  }
}
```
