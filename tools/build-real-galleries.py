from pathlib import Path
import re

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
MAX_EDGE = 1800
QUALITY = 76
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

GALLERIES = [
    {
        "slug": "shachi-vedant",
        "source": Path(r"D:\BlurryVisuals-Wedding-publish\img\for Wedding website\Shachi & Vedant\for web"),
        "cover": "snv web-251.jpg",
    },
    {
        "slug": "vedin-megha",
        "source": Path(r"D:\BlurryVisuals-Wedding-publish\img\for Wedding website\Vedin & Megha\for web"),
        "cover": "Vnm Web-195.jpg",
    },
]


def natural_key(path):
    parts = re.split(r"(\d+)", path.name)
    return [int(part) if part.isdigit() else part.lower() for part in parts]


def save_webp(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        longest = max(image.size)
        if longest > MAX_EDGE:
            scale = MAX_EDGE / longest
            size = (round(image.width * scale), round(image.height * scale))
            image = image.resize(size, Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=QUALITY, method=6)


def build_gallery(config):
    source_dir = config["source"]
    if not source_dir.exists():
        raise FileNotFoundError(source_dir)

    files = sorted(
        [path for path in source_dir.iterdir() if path.suffix.lower() in EXTENSIONS],
        key=natural_key,
    )
    if not files:
        raise RuntimeError(f"No image files found in {source_dir}")

    output_dir = ROOT / "img" / "stories" / config["slug"]
    for index, source in enumerate(files, start=1):
        save_webp(source, output_dir / f"{index:03d}.webp")

    cover_source = source_dir / config["cover"]
    if not cover_source.exists():
        cover_source = files[0]
    save_webp(cover_source, output_dir / "cover.webp")

    return config["slug"], len(files), cover_source


def main():
    for config in GALLERIES:
        slug, count, cover_source = build_gallery(config)
        print(f"{slug}: wrote {count} gallery files; cover from {cover_source.name}")


if __name__ == "__main__":
    main()
