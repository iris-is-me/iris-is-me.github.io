import shutil
import json

from pathlib import Path
from datetime import datetime, timezone


ROOT = Path(__file__).parent
BUILD = ROOT / "build"


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

    print(f"Built website in {BUILD}")


if __name__ == "__main__":
    main()