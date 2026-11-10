"""Compile and run a single console exercise inside its disposable container."""

import json
import os
from pathlib import Path
import re
import selectors
import signal
import subprocess
import sys
import tempfile
import time

MAX_REQUEST = 196_608
MAX_OUTPUT = 16_384
SOURCE_PATH = re.compile(r"(?:[A-Za-z0-9_-]+/)*[A-Za-z0-9_-]+\.[a-z]+")
COMPILER_ENV = {
    "PATH": "/usr/local/bin:/usr/bin:/bin",
    "HOME": "/tmp",
    "LANG": "C.UTF-8",
    "LC_ALL": "C.UTF-8",
    "TMPDIR": "/tmp",
}


def stop_group(process):
    try:
        os.killpg(process.pid, signal.SIGKILL)
    except ProcessLookupError:
        pass


def collect(argv, directory, stdin, seconds):
    data = {"stdout": bytearray(), "stderr": bytearray()}
    total = 0
    stopped = None
    deadline = time.monotonic() + seconds
    with subprocess.Popen(
        argv,
        cwd=directory,
        stdin=stdin,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=COMPILER_ENV,
        start_new_session=True,
    ) as process, selectors.DefaultSelector() as poll:
        try:
            poll.register(process.stdout, selectors.EVENT_READ, "stdout")
            poll.register(process.stderr, selectors.EVENT_READ, "stderr")
            while poll.get_map():
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    stopped = "timeout"
                    break
                for key, _ in poll.select(remaining):
                    block = os.read(key.fd, 4096)
                    if not block:
                        poll.unregister(key.fileobj)
                        continue
                    capacity = MAX_OUTPUT - total
                    data[key.data].extend(block[:capacity])
                    total += len(block)
                    if total > MAX_OUTPUT:
                        stopped = "output-limit"
                        break
                if stopped:
                    break
            if not stopped:
                try:
                    process.wait(timeout=max(0, deadline - time.monotonic()))
                except subprocess.TimeoutExpired:
                    stopped = "timeout"
        finally:
            stop_group(process)
            process.wait()
    stdout = data["stdout"].decode("utf-8", "replace")
    stderr = data["stderr"].decode("utf-8", "replace")
    return stopped, process.returncode, stdout, stderr


def commands(language, files):
    if language == "c":
        return (
            ["gcc", "-std=c17", "-Wall", "-Wextra", "-Wpedantic", *files,
             "-lm", "-o", "atelier"],
            ["./atelier"],
        )
    if language == "cpp":
        return (
            ["g++", "-std=c++20", "-Wall", "-Wextra", "-Wpedantic", *files,
             "-o", "atelier"],
            ["./atelier"],
        )
    if language == "java":
        return (
            ["javac", "-J-XX:+UseSerialGC", "-J-XX:ActiveProcessorCount=1", "-J-Xmx128m", "-proc:none", "-encoding", "UTF-8",
             "--release", "17", "-d", "classes", *files],
            ["java", "-XX:+UseSerialGC", "-XX:ActiveProcessorCount=1", "-Xmx128m", "-cp", "classes", "Main"],
        )
    if language == "python":
        return ["python3", "-s", "-E", "-m", "py_compile", *files], ["python3", "-s", "-E", "main.py"]
    if language == "nodejs":
        return None, ["node", "main.mjs"]
    if language == "typescript":
        return (
            ["tsc", "--strict", "--noEmitOnError", "--target", "ES2022",
             "--module", "commonjs", "--skipLibCheck", "--typeRoots",
             "/usr/local/lib/node_modules/@types", "--types", "node",
             "--outDir", "out", *files],
            ["node", "out/main.js"],
        )
    if language == "php":
        return None, ["php", "main.php"]
    raise ValueError("Invalid language")


def result(status, stage, diagnostics, stdout="", stderr="", exit_code=None):
    return {
        "status": status,
        "stage": stage,
        "diagnostics": diagnostics,
        "stdout": stdout,
        "stderr": stderr,
        "exitCode": exit_code,
    }


def execute(payload, root):
    language = payload["language"]
    sources = payload["sources"]
    suffixes = {
        "c": {".c"},
        "cpp": {".cpp", ".cc", ".cxx"},
        "java": {".java"},
        "python": {".py"},
        "nodejs": {".mjs", ".cjs", ".js"},
        "typescript": {".ts"},
        "php": {".php"},
    }[language]
    with tempfile.TemporaryDirectory(prefix="atelier-", dir=root) as folder:
        workspace = Path(folder)
        units = []
        for name, code in sources.items():
            if not SOURCE_PATH.fullmatch(name):
                raise ValueError("Invalid source path")
            file = workspace / name
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text(code, encoding="utf-8")
            if file.suffix in suffixes:
                units.append("./" + name)
        if not units:
            raise ValueError("No compilation units")
        if language == "java":
            (workspace / "classes").mkdir()
        compile_command, run_command = commands(language, units)
        checks = [compile_command]
        if language == "nodejs":
            checks = [["node", "--check", file] for file in units]
        elif language == "php":
            checks = [["php", "-l", file] for file in units]
        diagnostics = ""
        for check in checks:
            stopped, code, out, err = collect(check, workspace, subprocess.DEVNULL, 10)
            diagnostics += out + err
            if stopped or code:
                return result(stopped or "compile-error", "compile", diagnostics, exit_code=code)
            if len(diagnostics.encode("utf-8")) > MAX_OUTPUT:
                return result("output-limit", "compile", diagnostics[:MAX_OUTPUT])

        with tempfile.TemporaryFile(dir=workspace) as input_file:
            input_file.write(payload["stdin"].encode("utf-8"))
            input_file.seek(0)
            stopped, code, out, err = collect(run_command, workspace, input_file, 3)
        status = stopped or ("runtime-error" if code else "ok")
        return result(status, "run", diagnostics, out, err, code)


if __name__ == "__main__":
    raw = sys.stdin.buffer.read(MAX_REQUEST + 1)
    if len(raw) > MAX_REQUEST:
        raise ValueError("Request too large")
    print(json.dumps(execute(json.loads(raw), "/work"), ensure_ascii=True))
