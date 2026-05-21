import sys
from PIL import Image
import os

Image.MAX_IMAGE_PIXELS = None

def compress_image(in_path, out_path):
    try:
        im = Image.open(in_path)
        if im.mode == "P":
            im = im.convert("RGBA")
        
        # Resize if width > 1080
        if im.width > 1080:
            new_height = int(im.height * (1080 / im.width))
            im = im.resize((1080, new_height), Image.Resampling.LANCZOS)

        im.save(out_path, "webp", quality=75)
        print(f"Compressed {in_path} to {out_path}")
        
        os.remove(in_path)
        print(f"Removed {in_path}")
    except Exception as e:
        print(f"Error compressing {in_path}: {e}")

for i in range(1, 4):
    in_path = f"assets/intro-{i}.png"
    out_path = f"assets/intro-{i}.webp"
    if os.path.exists(in_path):
        compress_image(in_path, out_path)
    else:
        print(f"{in_path} not found.")
