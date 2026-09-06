from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path(r"D:\BlurryVisuals-Wedding-publish\img")
OUTPUT_ROOT = ROOT / "img" / "founders"
MAX_EDGE = 1600
QUALITY = 84
SOURCES = {
    "akash.webp": SOURCE_ROOT / "Akash.jpeg",
    "gautam.webp": SOURCE_ROOT / "Gautam.jpg",
}


def save_webp(source, destination):
    if not source.exists():
        raise FileNotFoundError(source)

    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        longest = max(image.size)
        if longest > MAX_EDGE:
            scale = MAX_EDGE / longest
            output_size = (
                round(image.width * scale),
                round(image.height * scale),
            )
            image = image.resize(output_size, Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=QUALITY, method=6)


def main():
    for filename, source in SOURCES.items():
        destination = OUTPUT_ROOT / filename
        save_webp(source, destination)
        print(filename + ": optimized from " + source.name)


if __name__ == "__main__":
    main()
