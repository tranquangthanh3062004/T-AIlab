# Code Execution Security Architecture — AI Learning OS

**Version**: 1.0.0  
**Status**: Active  
**Author**: Security Engineer & DevOps/SRE Lead

---

## 1. Threat Model & Security Boundaries

Executing untrusted, user-submitted Python code in an interactive education and engineering platform introduces serious attack vectors:
1. **Remote Code Execution (RCE)**: Arbitrary process execution (`subprocess.Popen`, `os.system`).
2. **File System Escape / Data Leakage**: Reading server environment files, source code, or private user files (`open('/etc/passwd')`, `os.walk`).
3. **Denial of Service (DoS)**: Infinite loops, memory allocation bombs (`[0] * 10**9`), fork bombs.
4. **Network Exfiltration (SSRF)**: Connecting to internal metadata services (e.g., `http://169.254.169.254`) or malicious command-and-control servers (`socket.connect`, `urllib`).

---

## 2. Multi-Layer Defense in Depth

```
User Submits Code
       │
       ▼
[ Layer 1: Static AST Analysis ]
       ├── Parse AST using Python's `ast` module.
       ├── Inspect all `Import` and `ImportFrom` nodes against Banned Module List.
       ├── Inspect all `Call` and `Attribute` nodes against Banned Builtins & Escapes (`eval`, `exec`, `__subclasses__`).
       └── REJECT immediately if dangerous pattern is found (HTTP 400 with honest explanation).
       │ (Passed)
       ▼
[ Layer 2: Dedicated Disposable Subprocess ]
       ├── Write code to an ephemeral scratch file inside isolated temporary directory.
       ├── Execute using non-root Python runner with:
       │     - Strict execution timeout (Default: 5 seconds, max 10 seconds).
       │     - Limited environment variables (Strip system PATH, strip API keys, strip secrets).
       │     - Output truncation cap (Max 64 KB stdout/stderr) to prevent buffer overflows.
       ├── Terminate and kill process group on timeout.
       └── Clean up temporary execution files immediately after completion.
       │
       ▼
[ Layer 3: Honest Output Stream ]
       ├── Real exit code, stdout, and stderr returned to user.
       └── Zero fabrication: If execution fails or times out, return exact truthful status.
```

---

## 3. Banned Identifiers & Modules Policy

### Strictly Banned Modules:
- `os`, `sys`, `subprocess`, `shutil`, `socket`, `pty`, `platform`
- `ctypes`, `builtins`, `importlib`, `code`, `codeop`, `compileall`
- `threading`, `multiprocessing`, `concurrent`, `signal`
- `urllib`, `requests`, `httpx`, `http`, `ftplib`, `poplib`, `imaplib`
- `pickle`, `marshal`, `shelve`, `dbm`

### Strictly Banned Builtin Functions / Patterns:
- `eval`, `exec`, `compile`, `__import__`, `open` (restricted or redirected to virtual mock FS)
- Accessing `__subclasses__`, `__globals__`, `__code__`, `__builtins__`

---

## 4. Production Roadmap: MicroVM / gVisor Sandboxes
For multi-tenant cloud deployment beyond local workstation mode, the execution runner is designed to dispatch to ephemeral Firecracker microVMs or Docker containers configured with:
- Read-only root filesystem.
- Zero network egress (`--network none`).
- cgroups v2 memory limits (512 MB per container) and CPU quota (1.0 CPU).
- Ephemeral writable volume wiped on container termination.
