import os
from PIL import Image, ImageDraw, ImageFont

SRC_IMG = "/tmp/pin1_zen.jpg"
OUT_DIR = "/Users/kobujang/Desktop/cording/my-love-sudoku/public/assets/backgrounds"
os.makedirs(OUT_DIR, exist_ok=True)

# Colors
BG_COLOR = (252, 249, 244)
TEXT_DARK = (24, 24, 24)
TEXT_MUTED = (85, 75, 70)
LINE_COLOR = (28, 28, 28)
SEAL_RED = (180, 35, 35)

LEVEL_DATA = [
  {
    "id": 1,
    "world_name": "첫걸음",
    "difficulty": "입문",
    "sub_title": "——  1단계: 첫걸음 (입문)  ——",
    "pill_text": "BEGINNER · 입문 레벨",
    "seal_text": ["평", "온"]
  },
  {
    "id": 2,
    "world_name": "논리의 길",
    "difficulty": "초급",
    "sub_title": "——  2단계: 논리의 길 (초급)  ——",
    "pill_text": "EASY · 초급 레벨",
    "seal_text": ["통", "찰"]
  },
  {
    "id": 3,
    "world_name": "도전의 탑",
    "difficulty": "중급",
    "sub_title": "——  3단계: 도전의 탑 (중급)  ——",
    "pill_text": "NORMAL · 중급 레벨",
    "seal_text": ["정", "진"]
  },
  {
    "id": 4,
    "world_name": "전문가의 성",
    "difficulty": "고급",
    "sub_title": "——  4단계: 전문가의 성 (고급)  ——",
    "pill_text": "HARD · 고급 레벨",
    "seal_text": ["지", "혜"]
  },
  {
    "id": 5,
    "world_name": "마스터 리그",
    "difficulty": "최고급",
    "sub_title": "——  5단계: 마스터 리그 (최고급)  ——",
    "pill_text": "MASTER · 마스터 레벨",
    "seal_text": ["극", "치"]
  }
]

# Load fonts
font_kr_top = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 20)
font_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 46)
font_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 16)
font_pill = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 13)
font_rules_head = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 15)
font_rules = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 13)
font_cheer = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 13)
font_seal = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 15)

for level in LEVEL_DATA:
  # Open fresh copy of pin1_zen.jpg
  img = Image.open(SRC_IMG).convert("RGB")
  draw = ImageDraw.Draw(img)
  
  # 1. Clean top text area (remove Japanese text)
  draw.rectangle([130, 20, 580, 222], fill=BG_COLOR)
  
  # 2. Clean entire grid area (remove old numbers and grid fragments)
  draw.rectangle([95, 220, 645, 746], fill=BG_COLOR)
  
  # 3. Clean entire bottom text area (remove Japanese rules and footer)
  draw.rectangle([140, 746, 600, 1020], fill=BG_COLOR)
  
  # 4. Clean old Japanese seal
  draw.rectangle([665, 790, 715, 890], fill=BG_COLOR)
  
  # Redraw authentic 9x9 grid lines
  for i in range(10):
    # Horizontal lines
    y = 227 + i * (486 // 9)
    lw = 3 if i in (0, 3, 6, 9) else 1
    draw.line([(105, y), (635, y)], fill=LINE_COLOR, width=lw)
    
    # Vertical lines
    x = 105 + i * (530 // 9)
    lw = 3 if i in (0, 3, 6, 9) else 1
    draw.line([(x, 227), (x, 713)], fill=LINE_COLOR, width=lw)
    
  # Write Top Korean Texts
  draw.text((368, 48), "스  도  쿠", fill=TEXT_MUTED, font=font_kr_top, anchor="mm")
  draw.text((368, 98), "내사랑 스도쿠", fill=TEXT_DARK, font=font_title, anchor="mm")
  draw.text((368, 146), level["sub_title"], fill=TEXT_MUTED, font=font_sub, anchor="mm")
  
  # Pill badge
  draw.rounded_rectangle([290, 168, 446, 194], radius=11, fill=(238, 228, 218), outline=(210, 195, 182), width=1)
  draw.text((368, 181), level["pill_text"], fill=(100, 85, 75), font=font_pill, anchor="mm")
  
  # Write Bottom Korean Rules
  draw.text((368, 750), "❖  스도쿠 기본 규칙  ❖", fill=(70, 60, 55), font=font_rules_head, anchor="mm")
  draw.line([(220, 765), (516, 765)], fill=(215, 205, 195), width=1)
  
  rules = [
    "① 1부터 9까지의 숫자를 사용합니다.",
    "② 각 가로줄(행)에 1~9가 하나씩 들어갑니다.",
    "③ 각 세로줄(열)에 1~9가 하나씩 들어갑니다.",
    "④ 굵은 선의 3×3 블록에 1~9가 하나씩 들어갑니다."
  ]
  for idx, r in enumerate(rules):
    draw.text((230, 785 + idx * 26), r, fill=(60, 50, 45), font=font_rules)
    
  draw.text((368, 930), "❖ 편안한 마음으로 즐겁게 풀어보세요! ❖", fill=(95, 80, 75), font=font_cheer, anchor="mm")
  
  # Red Korean Seal Stamp
  draw.rectangle([670, 806, 702, 852], outline=SEAL_RED, width=2)
  draw.text((686, 818), level["seal_text"][0], fill=SEAL_RED, font=font_seal, anchor="mm")
  draw.text((686, 840), level["seal_text"][1], fill=SEAL_RED, font=font_seal, anchor="mm")
  
  # Save optimized for mobile
  lid = level["id"]
  webp_out = os.path.join(OUT_DIR, f"zen_level_{lid}.webp")
  jpg_out = os.path.join(OUT_DIR, f"zen_level_{lid}.jpg")
  
  img.save(webp_out, "WEBP", quality=82, method=6)
  img.save(jpg_out, "JPEG", quality=82, optimize=True, progressive=True)
  
  print(f"Level {lid}: WebP={os.path.getsize(webp_out)/1024:.1f}KB, JPG={os.path.getsize(jpg_out)/1024:.1f}KB")

print("All 5 Zen Level backgrounds successfully generated!")
