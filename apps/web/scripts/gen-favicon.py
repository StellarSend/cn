"""
Generate SO4 favicon.ico and PNG assets from the logo mark.
Uses supersampling (4× then LANCZOS downscale) for anti-aliased edges.
Writes the ICO manually so all three sizes are embedded reliably.

Run from the repo root:  python3 apps/web/scripts/gen-favicon.py
"""

import io
import struct
from pathlib import Path
from PIL import Image, ImageDraw

OUT_DIR = Path(__file__).parent.parent / "public"

# Brand colours
BG         = (10,  11,  13,  255)   # #0A0B0D  background
ACCENT     = (77,  184, 255, 255)   # #4DB8FF  solid
ACCENT_DIM = (77,  184, 255, 120)   # #4DB8FF  ~47% (diagonals)
FILL       = (77,  184, 255, 22)    # #4DB8FF  8%  (hexagon fill)

# Original SVG coordinates (viewBox 0 0 24 24)
HEX_PTS = [(4,6),(12,2),(20,6),(20,14),(12,18),(4,14)]
VERT    = ((12, 2),  (12, 18))
DIAG1   = ((4,  6),  (20, 14))
DIAG2   = ((20, 6),  (4,  14))


def svg_pt(x, y, canvas: int, padding: float = 0.10):
    inner = canvas * (1 - 2 * padding)
    off   = canvas * padding
    return (x / 24 * inner + off,  y / 24 * inner + off)


def make_frame(target: int) -> Image.Image:
    """Render at 4× then downsample — gives smooth anti-aliased lines."""
    ss = target * 4
    r  = round(ss * 0.18)

    img  = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([0, 0, ss - 1, ss - 1], radius=r, fill=BG)

    def p(x, y):  return svg_pt(x, y, ss)
    def ps(pairs): return [p(x, y) for x, y in pairs]

    w_main = max(2, round(1.5 * ss / 24))
    w_dim  = max(1, round(0.65 * ss / 24))

    draw.polygon(ps(HEX_PTS), fill=FILL)
    draw.line(ps(HEX_PTS) + [ps(HEX_PTS)[0]], fill=ACCENT, width=w_main, joint="curve")
    draw.line([p(*VERT[0]),  p(*VERT[1])],  fill=ACCENT,     width=w_main)
    draw.line([p(*DIAG1[0]), p(*DIAG1[1])], fill=ACCENT_DIM, width=w_dim)
    draw.line([p(*DIAG2[0]), p(*DIAG2[1])], fill=ACCENT_DIM, width=w_dim)

    return img.resize((target, target), Image.LANCZOS)


def build_ico(frames: list[Image.Image]) -> bytes:
    """
    Manually assemble a multi-size ICO with PNG-encoded image data.
    PIL's ICO writer drops extra frames in some versions — doing it by hand
    is the only reliable way to guarantee every size is present.

    Format:
      ICONDIR   (6 bytes)
      ICONDIRENTRY × N   (16 bytes each)
      PNG data × N
    """
    # PNG-encode each frame
    buffers: list[bytes] = []
    for frame in frames:
        buf = io.BytesIO()
        frame.save(buf, format="PNG", optimize=True)
        buffers.append(buf.getvalue())

    count       = len(frames)
    header_size = 6 + count * 16          # ICONDIR + all entries
    offsets: list[int] = []
    cur = header_size
    for b in buffers:
        offsets.append(cur)
        cur += len(b)

    ico = bytearray()
    ico += struct.pack("<HHH", 0, 1, count)            # ICONDIR

    for i, (frame, buf) in enumerate(zip(frames, buffers)):
        w, h = frame.size
        ico += struct.pack(
            "<BBBBHHII",
            0 if w == 256 else w,   # bWidth  (0 encodes 256)
            0 if h == 256 else h,   # bHeight
            0,                      # bColorCount
            0,                      # bReserved
            1,                      # wPlanes
            32,                     # wBitCount
            len(buf),               # dwBytesInRes
            offsets[i],             # dwImageOffset
        )

    for buf in buffers:
        ico += buf

    return bytes(ico)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # ── favicon.ico — 16, 32, 48 ─────────────────────────────────
    ico_sizes  = [16, 32, 48]
    ico_frames = [make_frame(s) for s in ico_sizes]
    ico_path   = OUT_DIR / "favicon.ico"
    ico_path.write_bytes(build_ico(ico_frames))
    print(f"✓  {ico_path}  ({', '.join(f'{s}×{s}' for s in ico_sizes)})")

    # ── apple-touch-icon.png — 180×180 ───────────────────────────
    atp = make_frame(180)
    atp_path = OUT_DIR / "apple-touch-icon.png"
    atp.save(atp_path, format="PNG", optimize=True)
    print(f"✓  {atp_path}  (180×180)")

    # ── PWA icons ─────────────────────────────────────────────────
    for size, name in [(192, "logo192.png"), (512, "logo512.png")]:
        img  = make_frame(size)
        path = OUT_DIR / name
        img.save(path, format="PNG", optimize=True)
        print(f"✓  {path}  ({size}×{size})")


if __name__ == "__main__":
    main()
