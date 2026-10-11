import ast
import os
import sys
import tempfile
import time
import subprocess
from pathlib import Path
from app.schemas.execution import CodeExecutionResponse

BANNED_MODULES = {
    "os", "sys", "subprocess", "shutil", "socket", "pty", "platform",
    "ctypes", "builtins", "importlib", "code", "codeop", "compileall",
    "threading", "multiprocessing", "concurrent", "signal",
    "urllib", "requests", "httpx", "http", "ftplib", "poplib", "imaplib",
    "pickle", "marshal", "shelve", "dbm", "posix", "nt"
}

BANNED_CALLS = {"eval", "exec", "compile", "__import__"}
BANNED_ATTRS = {"__subclasses__", "__globals__", "__code__", "__builtins__"}

class SecurityVisitor(ast.NodeVisitor):
    def __init__(self):
        self.errors = []

    def visit_Import(self, node):
        for alias in node.names:
            base_mod = alias.name.split(".")[0]
            if base_mod in BANNED_MODULES:
                self.errors.append(f"Importing module '{alias.name}' is strictly prohibited for security reasons.")
        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        if node.module:
            base_mod = node.module.split(".")[0]
            if base_mod in BANNED_MODULES:
                self.errors.append(f"Importing from module '{node.module}' is strictly prohibited for security reasons.")
        self.generic_visit(node)

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name):
            if node.func.id in BANNED_CALLS:
                self.errors.append(f"Calling built-in '{node.func.id}()' is strictly prohibited.")
        self.generic_visit(node)

    def visit_Attribute(self, node):
        if node.attr in BANNED_ATTRS:
            self.errors.append(f"Accessing introspection attribute '{node.attr}' is prohibited.")
        self.generic_visit(node)

def validate_python_code_security(code: str) -> tuple[bool, str | None]:
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return False, f"Syntax Error: {e.msg} at line {e.lineno}"

    visitor = SecurityVisitor()
    visitor.visit(tree)
    if visitor.errors:
        return False, "; ".join(visitor.errors)
    return True, None

def execute_sandboxed_code(
    code: str,
    timeout_seconds: int = 5,
    test_assertions: str | None = None
) -> CodeExecutionResponse:
    start_time = time.perf_counter()

    # Step 1: Static AST Security Check
    is_safe, security_reason = validate_python_code_security(code)
    if not is_safe:
        return CodeExecutionResponse(
            success=False,
            stdout="",
            stderr=f"Security Violation: {security_reason}",
            exit_code=1,
            execution_time_ms=round((time.perf_counter() - start_time) * 1000, 2),
            security_flagged=True,
            security_reason=security_reason
        )

    # If test assertions are provided, check their AST security too
    if test_assertions:
        test_safe, test_sec_reason = validate_python_code_security(test_assertions)
        if not test_safe:
            return CodeExecutionResponse(
                success=False,
                stdout="",
                stderr=f"Test code security violation: {test_sec_reason}",
                exit_code=1,
                execution_time_ms=round((time.perf_counter() - start_time) * 1000, 2),
                security_flagged=True,
                security_reason=test_sec_reason
            )

    # Step 2: Prepare temporary execution script
    combined_code = code
    if test_assertions:
        combined_code += "\n\n# --- AUTOMATED TEST VERIFICATION ---\n" + test_assertions

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_file = Path(temp_dir) / "runner.py"
        temp_file.write_text(combined_code, encoding="utf-8")

        # Sanitize environment to prevent leaking host secrets
        clean_env = {
            "PYTHONUNBUFFERED": "1",
            "PYTHONIOENCODING": "utf-8",
            "SYSTEMROOT": os.environ.get("SYSTEMROOT", "C:\\Windows"),
            "PATH": os.environ.get("PATH", "")
        }

        try:
            proc = subprocess.run(
                [sys.executable, str(temp_file)],
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                cwd=temp_dir,
                env=clean_env
            )
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

            stdout = proc.stdout[:65536] if proc.stdout else ""
            stderr = proc.stderr[:65536] if proc.stderr else ""

            passed_tests = None
            test_feedback = None
            if test_assertions:
                if proc.returncode == 0:
                    passed_tests = True
                    test_feedback = "All test assertions passed successfully!"
                else:
                    passed_tests = False
                    test_feedback = f"Test assertion failed:\n{stderr.strip()}"

            return CodeExecutionResponse(
                success=(proc.returncode == 0),
                stdout=stdout,
                stderr=stderr,
                exit_code=proc.returncode,
                execution_time_ms=elapsed_ms,
                passed_tests=passed_tests,
                test_feedback=test_feedback
            )

        except subprocess.TimeoutExpired:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return CodeExecutionResponse(
                success=False,
                stdout="",
                stderr=f"Execution timed out after {timeout_seconds} seconds.",
                exit_code=124,
                execution_time_ms=elapsed_ms,
                security_flagged=False,
                passed_tests=False if test_assertions else None,
                test_feedback="Execution timed out." if test_assertions else None
            )
        except Exception as e:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return CodeExecutionResponse(
                success=False,
                stdout="",
                stderr=f"Runtime error during subprocess execution: {str(e)}",
                exit_code=1,
                execution_time_ms=elapsed_ms
            )
