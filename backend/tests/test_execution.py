from app.services.execution import execute_sandboxed_code, validate_python_code_security

def test_safe_arithmetic_execution():
    code = """
a = 15
b = 25
print(f"SUM={a + b}")
"""
    result = execute_sandboxed_code(code)
    assert result.success is True
    assert "SUM=40" in result.stdout
    assert result.exit_code == 0
    assert result.security_flagged is False

def test_ast_rejects_import_os():
    code = "import os\nprint(os.getcwd())"
    is_safe, reason = validate_python_code_security(code)
    assert is_safe is False
    assert "os" in reason

    res = execute_sandboxed_code(code)
    assert res.success is False
    assert res.security_flagged is True
    assert "strictly prohibited" in res.stderr

def test_ast_rejects_subprocess():
    code = "import subprocess\nsubprocess.run(['dir'])"
    res = execute_sandboxed_code(code)
    assert res.success is False
    assert res.security_flagged is True

def test_ast_rejects_eval():
    code = "eval('1 + 1')"
    res = execute_sandboxed_code(code)
    assert res.success is False
    assert res.security_flagged is True
    assert "eval" in res.stderr

def test_ast_rejects_introspection_escape():
    code = "x = ().__class__.__bases__[0].__subclasses__()"
    res = execute_sandboxed_code(code)
    assert res.success is False
    assert res.security_flagged is True
    assert "__subclasses__" in res.stderr

def test_execution_timeout_watchdog():
    # Infinite while loop
    code = "while True:\n    pass"
    res = execute_sandboxed_code(code, timeout_seconds=2)
    assert res.success is False
    assert "timed out" in res.stderr
    assert res.exit_code == 124

def test_exercise_test_assertion_pass():
    code = """
def add(a, b):
    return a + b
"""
    test_assertions = "assert add(2, 3) == 5\nassert add(-1, 1) == 0"
    res = execute_sandboxed_code(code, test_assertions=test_assertions)
    assert res.success is True
    assert res.passed_tests is True
    assert "passed successfully" in res.test_feedback

def test_exercise_test_assertion_fail():
    code = """
def add(a, b):
    return a * b  # Wrong operation
"""
    test_assertions = "assert add(2, 3) == 5"
    res = execute_sandboxed_code(code, test_assertions=test_assertions)
    assert res.success is False
    assert res.passed_tests is False
    assert "AssertionError" in res.test_feedback
