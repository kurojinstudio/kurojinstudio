"""One-time image optimization pass for Kurojin site.
- Converts giant PNGs to JPEG/WebP (keep alpha -> webp, else jpeg q82)
- Caps max dimension (default 2200px for bgs, 1400px for gallery)
- Builds the missing /public/images/work/01-09.jpg from All/ artboards
Run from repo root: python scripts/optimize-images.py
"""
import os
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public", "images")

def has_alpha(im):
    return im.mode in ("RGBA", "LA", "PA") or (im.mode == "P" and "transparency" in im.info)

def save_opt(im, out_path, max_dim, quality=82):
    im = im.convert("RGBA") if has_alpha(im) else im.convert("RGB")
    w, h = im.size
    if max(w, h) > max_dim:
        scale = max_dim / max(w, h)
        im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    if has_alpha(im):
        # flatten near-black bg for jpeg if alpha is trivial, else webp
        bbox = im.getchannel("A").getbbox()
        if bbox is None:  # fully opaque
            im = im.convert("RGB")
            im.save(out_path, "JPEG", quality=quality, optimize=True)
        else:
            wp = os.path.splitext(out_path)[0] + ".webp"
            im.save(wp, "WEBP", quality=quality, method=6)
            return wp
    else:
        im.save(out_path, "JPEG", quality=quality, optimize=True)
    return out_path

def process(rel_path, max_dim, quality=82, keep_original=True):
    src = os.path.join(PUB, rel_path)
    if not os.path.exists(src):
        print(f"SKIP (missing): {rel_path}")
        return
    before = os.path.getsize(src)
    im = Image.open(src)
    base, ext = os.path.splitext(src)
    out = base + ".jpg"
    result = save_opt(im, out, max_dim, quality)
    after = os.path.getsize(result)
    if keep_original and result != src and os.path.abspath(result) != os.path.abspath(src):
        bak = src + ".orig"
        if not os.path.exists(bak):
            os.replace(src, bak)
    print(f"{rel_path}: {before/1e6:.1f}MB -> {os.path.basename(result)} {after/1e3:.0f}KB")

# --- Hero / section backgrounds (huge, unused or heavy) ---
for f in ["hero-bg.png", "globally.png", "clients-bg.png", "services-bg.png",
          "story-bg.png", "work-bg.png", "1global.png"]:
    process(f, max_dim=2200, quality=80)

# --- Contact trail images + work page source artboards ---
os.makedirs(os.path.join(PUB, "work"), exist_ok=True)
for i in range(1, 10):
    src_name = f"All/Artboard-{i}.png"
    src = os.path.join(PUB, src_name)
    if not os.path.exists(src):
        print(f"SKIP work/{i:02d} (missing {src_name})")
        continue
    im = Image.open(src)
    out = os.path.join(PUB, "work", f"{i:02d}.jpg")
    # flatten alpha onto black, force JPEG for work cards
    if has_alpha(im):
        bg = Image.new("RGB", im.size, (0, 0, 0))
        bg.paste(im, mask=im.getchannel("A"))
        im = bg
    else:
        im = im.convert("RGB")
    w, h = im.size
    if max(w, h) > 1400:
        scale = 1400 / max(w, h)
        im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    im.save(out, "JPEG", quality=80, optimize=True)
    print(f"work/{i:02d}.jpg <- {src_name} ({os.path.getsize(out)/1e3:.0f}KB)")
    # also compress the All/ original in place for the trail effect
    process(src_name, max_dim=900, quality=72)

# --- Decor / icon ---
for f in ["kuro-icon.png", "decor-hero.png", "decor-clients.png", "decor-flower.png", "decor-plant.png"]:
    process(f, max_dim=800, quality=85)

print("DONE")
