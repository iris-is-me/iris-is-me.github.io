import shutil
import json

from pathlib import Path
from datetime import datetime, timezone


ROOT = Path(__file__).parent
BUILD = ROOT / "build"

version = {
    "version": datetime.now(timezone.utc).isoformat()
}

def inject_update_script():
    index = BUILD / "index.html"

    if not index.exists():
        raise FileNotFoundError(
            "index.html was not found in the build directory"
        )

    html = index.read_text(encoding="utf-8")

    script = '<script src="/update-check.js"></script>'

    if script not in html:
        html = html.replace(
            "</body>",
            f"    {script}\n</body>"
        )

    index.write_text(
        html,
        encoding="utf-8"
    )

def main():
    # Remove previous build
    if BUILD.exists():
        shutil.rmtree(BUILD)

    BUILD.mkdir()

    # Copy website files
    for path in ROOT.iterdir():
        if path.name in {
            ".git",
            ".github",
            "build",
            "build.py",
        }:
            continue

        destination = BUILD / path.name

        if path.is_dir():
            shutil.copytree(path, destination)
        else:
            shutil.copy2(path, destination)
    
    (BUILD / "version.json").write_text(
        json.dumps(version),
        encoding="utf-8"
    )

    inject_update_script()

    print(f"Built website in {BUILD}")


if __name__ == "__main__":
    main()