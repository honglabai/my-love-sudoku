import os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageOps

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
INK_MUTED = (85, 75, 70)
INK_LIGHT = (160, 150, 140)
SEAL_RED = (185, 36, 36)

FONT_TITLE = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleMyungjo.ttf", 36)
FONT_SUB = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 15)
FONT_PILL = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 12)
FONT_RULES_TITLE = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleMyungjo.ttf", 14)
FONT_RULES = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 12)
FONT_MOTTO = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleMyungjo.ttf", 13)
FONT_SEAL = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleMyungjo.ttf", 16)

src_full = Image.open(SRC_IMG).convert("RGB")

orig_tl = src_full.crop((0, 0, 220, 220))
orig_tr = src_full.crop((516, 0, 736, 220))
orig_bl = src_full.crop((0, 740, 220, 1040))
orig_br = src_full.crop((516, 740, 736, 1040))

LEVEL_CONFIGS = [
    {
        "id": 1,
        "world_name": "첫걸음",
        "difficulty": "입문",
        "sub_title": "제 1월드 · 첫걸음 (입문)",
        "pill": "BEGINNER · 평온의 정원",
        "motto": "맑은 마음으로 첫 수를 놓아보세요.",
        "seal": ["평", "온"],
        "theme_color": (210, 75, 115),
        "tint": "spring"
    },
    {
        "id": 2,
        "world_name": "논리의 길",
        "difficulty": "초급",
        "sub_title": "제 2월드 · 논리의 길 (초급)",
        "pill": "EASY · 푸른 대나무숲",
        "motto": "차분한 시선으로 논리의 실마리를 찾으세요.",
        "seal": ["통", "찰"],
        "theme_color": (40, 135, 80),
        "tint": "summer"
    },
    {
        "id": 3,
        "world_name": "도전의 탑",
        "difficulty": "중급",
        "sub_title": "제 3월드 · 도전의 탑 (중급)",
        "pill": "NORMAL · 황혼의 석탑",
        "motto": "깊은 집중으로 숨겨진 한 수를 밝히세요.",
        "seal": ["정", "진"],
        "theme_color": (185, 70, 35),
        "tint": "autumn"
    },
    {
        "id": 4,
        "world_name": "전문가의 성",
        "difficulty": "고급",
        "sub_title": "제 4월드 · 전문가의 성 (고급)",
        "pill": "HARD · 설산과 백매화",
        "motto": "정교한 추론으로 복잡한 실타래를 푸세요.",
        "seal": ["지", "혜"],
        "theme_color": (60, 100, 155),
        "tint": "winter"
    },
    {
        "id": 5,
        "world_name": "마스터 리그",
        "difficulty": "최고급",
        "sub_title": "제 5월드 · 마스터 리그 (최고급)",
        "pill": "MASTER · 붉은 달과 천년송",
        "motto": "완전한 통찰로 최고의 경지를 이루세요.",
        "seal": ["극", "치"],
        "theme_color": (180, 25, 40),
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
    
    draw.rectangle([10, 10, WIDTH - 10, HEIGHT - 10], outline=(232, 224, 212), width=1)
    draw.rectangle([16, 16, WIDTH - 16, HEIGHT - 16], outline=(240, 234, 224), width=1)
    
    # Corner elements
    tl = apply_tint(orig_tl, cfg["tint"]).resize((210, 190), Image.Resampling.LANCZOS)
    sheet.paste(tl, (0, 0))
    
    tr = apply_tint(orig_tr, cfg["tint"]).resize((210, 190), Image.Resampling.LANCZOS)
    sheet.paste(tr, (WIDTH - 210, 0))
    
    bl = apply_tint(orig_bl, cfg["tint"]).resize((200, 200), Image.Resampling.LANCZOS)
    sheet.paste(bl, (0, HEIGHT - 200))
    
    br = apply_tint(orig_br, cfg["tint"]).resize((200, 200), Image.Resampling.LANCZOS)
    sheet.paste(br, (WIDTH - 200, HEIGHT - 200))
    
    draw.rectangle([WIDTH - 75, HEIGHT - 170, WIDTH - 15, HEIGHT - 90], fill=BG_COLOR)
    
    # Board area
    draw.rectangle([BOARD_X, BOARD_Y, BOARD_X + BOARD_SIZE, BOARD_Y + BOARD_SIZE], fill=BG_COLOR)
    draw.rectangle([BOARD_X, BOARD_Y, BOARD_X + BOARD_SIZE, BOARD_Y + BOARD_SIZE], outline=INK_BLACK, width=3)
    
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
        draw.line([(BOARD_X, y), (BOARD_X + BOARD_SIZE, y)], fill=(225, 218, 208), width=1)
        x = BOARD_X + c * cell_size
        draw.line([(x, BOARD_Y), (x, BOARD_Y + BOARD_SIZE)], fill=(225, 218, 208), width=1)

    # Top typography
    draw.text((WIDTH // 2, 45), "내사랑 스도쿠", fill=INK_BLACK, font=FONT_TITLE, anchor="mm")
    draw.text((WIDTH // 2, 88), cfg["sub_title"], fill=INK_MUTED, font=FONT_SUB, anchor="mm")
    
    pill_w, pill_h = 200, 24
    pill_x0 = (WIDTH - pill_w) // 2
    pill_y0 = 112
    draw.rounded_rectangle([pill_x0, pill_y0, pill_x0 + pill_w, pill_y0 + pill_h], radius=12, fill=(245, 238, 226), outline=(215, 205, 190), width=1)
    draw.text((WIDTH // 2, pill_y0 + pill_h // 2), cfg["pill"], fill=cfg["theme_color"], font=FONT_PILL, anchor="mm")
    
    draw.line([(WIDTH // 2 - 120, 152), (WIDTH // 2 + 120, 152)], fill=(215, 205, 192), width=1)
    draw.text((WIDTH // 2, 152), "◆", fill=cfg["theme_color"], font=FONT_PILL, anchor="mm")
    draw.text((WIDTH // 2, 170), cfg["motto"], fill=INK_MUTED, font=FONT_MOTTO, anchor="mm")

    # Bottom typography
    rules_box_w = 300
    rules_box_h = 75
    rb_x0 = (WIDTH - rules_box_w) // 2
    rb_y0 = BOARD_Y + BOARD_SIZE + 24
    draw.rounded_rectangle([rb_x0, rb_y0, rb_x0 + rules_box_w, rb_y0 + rules_box_h], radius=8, fill=(247, 242, 232), outline=(225, 216, 202), width=1)
    
    draw.text((WIDTH // 2, rb_y0 + 16), "—  스 도 쿠  규 칙  —", fill=INK_MUTED, font=FONT_RULES_TITLE, anchor="mm")
    draw.text((WIDTH // 2, rb_y0 + 38), "가로줄 · 세로줄 · 3×3 박스에 1부터 9까지", fill=INK_BLACK, font=FONT_RULES, anchor="mm")
    draw.text((WIDTH // 2, rb_y0 + 56), "숫자를 중복 없이 단 한 번씩만 채워 넣으세요.", fill=INK_MUTED, font=FONT_RULES, anchor="mm")
    
    # Red seal stamp
    seal_x = WIDTH - 80
    seal_y = HEIGHT - 95
    seal_size = 46
    draw.rectangle([seal_x, seal_y, seal_x + seal_size, seal_y + seal_size], outline=SEAL_RED, width=3)
    draw.rectangle([seal_x + 3, seal_y + 3, seal_x + seal_size - 3, seal_y + seal_size - 3], outline=(220, 90, 90), width=1)
    draw.rectangle([seal_x + 4, seal_y + 4, seal_x + seal_size - 4, seal_y + seal_size - 4], fill=(255, 240, 240))
    draw.text((seal_x + seal_size // 2, seal_y + 14), cfg["seal"][0], fill=SEAL_RED, font=FONT_SEAL, anchor="mm")
    draw.text((seal_x + seal_size // 2, seal_y + 32), cfg["seal"][1], fill=SEAL_RED, font=FONT_SEAL, anchor="mm")
    
    webp_path = os.path.join(OUT_DIR, f"zen_sheet_level_{cfg['id']}.webp")
    jpg_path = os.path.join(OUT_DIR, f"zen_sheet_level_{cfg['id']}.jpg")
    sheet.save(webp_path, format="WEBP", quality=82, method=6)
    sheet.save(jpg_path, format="JPEG", quality=85, optimize=True)

print("Updated 5 Zen master sheets generated successfully!")
