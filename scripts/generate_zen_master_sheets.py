import os
from PIL import Image, ImageDraw, ImageEnhance, ImageOps, ImageFilter

SRC_IMG = "/tmp/pin1_zen.jpg"
OUT_DIR = "/Users/kobujang/Desktop/cording/my-love-sudoku/public/assets/backgrounds"
os.makedirs(OUT_DIR, exist_ok=True)

WIDTH = 720
HEIGHT = 960

BOARD_X = 80
BOARD_Y = 190
BOARD_SIZE = 560

BG_COLOR = (252, 248, 241)
INK_BLACK = (24, 24, 26)

src_full = Image.open(SRC_IMG).convert("RGB")

# Clean crops that strictly exclude any text, letters, or kanji:
# TL: Cherry blossoms (x <= 185, no 'S')
orig_tl = Image.new("RGB", (210, 190), BG_COLOR)
crop_tl = src_full.crop((0, 0, 185, 200)).resize((190, 190), Image.Resampling.LANCZOS)
orig_tl.paste(crop_tl, (0, 0))

# TR: Sun and Fuji Mountain (x >= 550, no 'U')
orig_tr = Image.new("RGB", (210, 190), BG_COLOR)
crop_tr = src_full.crop((550, 0, 736, 220)).resize((190, 190), Image.Resampling.LANCZOS)
orig_tr.paste(crop_tr, (20, 0))

# BL: Bamboo and Stone Lantern (x <= 175, no flowers/lines)
orig_bl = Image.new("RGB", (200, 200), BG_COLOR)
crop_bl = src_full.crop((0, 740, 175, 1040)).resize((180, 200), Image.Resampling.LANCZOS)
orig_bl.paste(crop_bl, (0, 0))

# BR: Pine Tree on Rock (softly erase Japanese 'が' and '平穏' seal)
crop_br = src_full.crop((500, 740, 736, 1040))
mask_br = Image.new('L', crop_br.size, 0)
d_br = ImageDraw.Draw(mask_br)
d_br.rectangle([0, 0, 42, 300], fill=255)
d_br.rectangle([130, 25, 236, 175], fill=255)
mask_br = mask_br.filter(ImageFilter.GaussianBlur(radius=4))
bg_patch = Image.new('RGB', crop_br.size, BG_COLOR)
crop_br = Image.composite(bg_patch, crop_br, mask_br)

orig_br = Image.new("RGB", (200, 200), BG_COLOR)
orig_br.paste(crop_br.resize((200, 200), Image.Resampling.LANCZOS), (0, 0))

LEVEL_CONFIGS = [
    {
        "id": 1,
        "world_name": "첫걸음",
        "tint": "spring"
    },
    {
        "id": 2,
        "world_name": "논리의 길",
        "tint": "summer"
    },
    {
        "id": 3,
        "world_name": "도전의 탑",
        "tint": "autumn"
    },
    {
        "id": 4,
        "world_name": "전문가의 성",
        "tint": "winter"
    },
    {
        "id": 5,
        "world_name": "마스터 리그",
        "tint": "transcendent"
    }
]

def apply_tint(im, tint_mode):
    if tint_mode == "spring":
        return im
    im_hsv = im.convert("HSV")
    h, s, v = im_hsv.split()
    
    if tint_mode == "summer":
        h = h.point(lambda p: (p + 35) % 256)
    elif tint_mode == "autumn":
        h = h.point(lambda p: (p + 240) % 256)
        s = ImageEnhance.Color(im).enhance(1.2).convert("HSV").split()[1]
    elif tint_mode == "winter":
        im_winter = ImageOps.colorize(im.convert("L"), black=(20, 30, 45), white=(250, 248, 242))
        return Image.blend(im, im_winter, 0.45)
    elif tint_mode == "transcendent":
        im_gold = ImageOps.colorize(im.convert("L"), black=(35, 15, 20), white=(255, 245, 230))
        return Image.blend(im, im_gold, 0.35)
        
    return Image.merge("HSV", (h, s, v)).convert("RGB")

for cfg in LEVEL_CONFIGS:
    sheet = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(sheet)
    
    # Outer decorative parchment border frames
    draw.rectangle([10, 10, WIDTH - 10, HEIGHT - 10], outline=(232, 224, 212), width=1)
    draw.rectangle([16, 16, WIDTH - 16, HEIGHT - 16], outline=(240, 234, 224), width=1)
    
    # Corner artwork elements (cherry blossoms, mountain, bamboo, pine tree)
    tl = apply_tint(orig_tl, cfg["tint"]).resize((210, 190), Image.Resampling.LANCZOS)
    sheet.paste(tl, (0, 0))
    
    tr = apply_tint(orig_tr, cfg["tint"]).resize((210, 190), Image.Resampling.LANCZOS)
    sheet.paste(tr, (WIDTH - 210, 0))
    
    bl = apply_tint(orig_bl, cfg["tint"]).resize((200, 200), Image.Resampling.LANCZOS)
    sheet.paste(bl, (0, HEIGHT - 200))
    
    br = apply_tint(orig_br, cfg["tint"]).resize((200, 200), Image.Resampling.LANCZOS)
    sheet.paste(br, (WIDTH - 200, HEIGHT - 200))
    
    # Clean bottom corner patch for smooth watercolor blend
    draw.rectangle([WIDTH - 75, HEIGHT - 170, WIDTH - 15, HEIGHT - 90], fill=BG_COLOR)
    
    # Board parchment area: clean canvas with subtle border
    draw.rectangle([BOARD_X, BOARD_Y, BOARD_X + BOARD_SIZE, BOARD_Y + BOARD_SIZE], fill=BG_COLOR)
    draw.rectangle([BOARD_X, BOARD_Y, BOARD_X + BOARD_SIZE, BOARD_Y + BOARD_SIZE], outline=INK_BLACK, width=2)
    
    # Subtle 3x3 block guidelines
    cell_size = BOARD_SIZE // 9
    box_size = cell_size * 3
    for b in range(1, 3):
        y = BOARD_Y + b * box_size
        draw.line([(BOARD_X, y), (BOARD_X + BOARD_SIZE, y)], fill=INK_BLACK, width=2)
        x = BOARD_X + b * box_size
        draw.line([(x, BOARD_Y), (x, BOARD_Y + BOARD_SIZE)], fill=INK_BLACK, width=2)
        
    for c in range(1, 9):
        if c in (3, 6): continue
        y = BOARD_Y + c * cell_size
        draw.line([(BOARD_X, y), (BOARD_X + BOARD_SIZE, y)], fill=(230, 223, 214), width=1)
        x = BOARD_X + c * cell_size
        draw.line([(x, BOARD_Y), (x, BOARD_Y + BOARD_SIZE)], fill=(230, 223, 214), width=1)

    # Note: ABSOLUTELY ZERO TEXT is drawn here! All typography is rendered cleanly via React DOM.
    webp_path = os.path.join(OUT_DIR, f"zen_sheet_level_{cfg['id']}.webp")
    jpg_path = os.path.join(OUT_DIR, f"zen_sheet_level_{cfg['id']}.jpg")
    sheet.save(webp_path, format="WEBP", quality=84, method=6)
    sheet.save(jpg_path, format="JPEG", quality=86, optimize=True)

print("Updated 5 clean Zen master sheets (without text) generated successfully!")
