import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

SRC_DIR = "/Users/kobujang/.gemini/antigravity/brain/fc30beb4-4e01-4297-a283-83ee714cee06"
OUT_DIR = "/Users/kobujang/Desktop/cording/my-love-sudoku/public/assets/backgrounds"
os.makedirs(OUT_DIR, exist_ok=True)

TARGET_SIZE = (720, 1280)

def optimize_and_save(img: Image.Image, base_name: str):
  # Resize to mobile portrait target
  resized = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
  
  # Save optimized WebP
  webp_path = os.path.join(OUT_DIR, f"{base_name}.webp")
  resized.save(webp_path, "WEBP", quality=82, method=6)
  
  # Save optimized JPEG fallback
  jpg_path = os.path.join(OUT_DIR, f"{base_name}.jpg")
  resized.save(jpg_path, "JPEG", quality=82, optimize=True, progressive=True)
  
  webp_size = os.path.getsize(webp_path) / 1024
  jpg_size = os.path.getsize(jpg_path) / 1024
  print(f"Saved {base_name}: WebP={webp_size:.1f}KB, JPG={jpg_size:.1f}KB")

# 1. Process World 1
w1_src = os.path.join(SRC_DIR, "world_1_spring_cherry_blossoms_1794236575200.jpg")
img1 = Image.open(w1_src)
optimize_and_save(img1, "world_1")
optimize_and_save(img1, "home_bg") # Default serene home background

# 2. Process World 2
w2_src = os.path.join(SRC_DIR, "world_2_bamboo_grove_1794236632877.jpg")
img2 = Image.open(w2_src)
optimize_and_save(img2, "world_2")

# 3. Process World 3
w3_src = os.path.join(SRC_DIR, "world_3_pagoda_of_challenge_1794236652049.jpg")
img3 = Image.open(w3_src)
optimize_and_save(img3, "world_3")

# Load font
try:
  font_seal = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 24)
except:
  font_seal = ImageFont.load_default()

def draw_seal(draw, text_lines, x, y):
  # Draw traditional Korean red square seal stamp
  pad = 8
  w = 64
  h = 64
  draw.rectangle([x, y, x + w, y + h], outline=(175, 35, 35), width=3)
  draw.rectangle([x + 3, y + 3, x + w - 3, y + h - 3], outline=(200, 60, 60, 160), width=1)
  
  line_y = y + 7
  for line in text_lines:
    draw.text((x + 10, line_y), line, fill=(185, 30, 30), font=font_seal)
    line_y += 24

# 4. Synthesize World 4: Autumn Palace (전문가의 성)
# Use Hanji paper base from img1 with autumn amber/crimson wash & Korean palace roofline
base4 = img1.copy().resize((720, 1280), Image.Resampling.LANCZOS)
# Soft autumn twilight gradient overlay
overlay4 = Image.new("RGBA", (720, 1280), (0, 0, 0, 0))
draw4 = ImageDraw.Draw(overlay4)

# Autumn warm amber watercolor wash across top and bottom
for y in range(500):
  alpha = int(110 * (1 - y / 500))
  draw4.line([(0, y), (720, y)], fill=(195, 80, 40, alpha))

for y in range(800, 1280):
  alpha = int(90 * ((y - 800) / 480))
  draw4.line([(0, y), (720, y)], fill=(120, 60, 40, alpha))

# Glowing soft full moon in upper-middle
moon_x, moon_y = 500, 240
for r in range(70, 0, -1):
  alpha = int(180 * (1 - r / 70))
  draw4.ellipse([moon_x - r, moon_y - r, moon_x + r, moon_y + r], fill=(255, 245, 210, alpha))

# Palace eaves curved silhouette in ink wash at bottom
roof_points = [
  (0, 1100), (80, 1070), (220, 1040), (380, 1030), (520, 1050), (660, 1080), (720, 1100),
  (720, 1280), (0, 1280)
]
draw4.polygon(roof_points, fill=(45, 40, 50, 140))
# Ridge line
draw4.line([(0, 1100), (80, 1070), (220, 1040), (380, 1030), (520, 1050), (660, 1080), (720, 1100)], fill=(30, 25, 35, 210), width=4)

# Autumn maple leaves falling (watercolors)
maple_colors = [(190, 45, 35, 200), (210, 85, 30, 190), (225, 145, 35, 180), (170, 30, 25, 210)]
import random
random.seed(42)
for _ in range(28):
  lx = random.randint(30, 680)
  ly = random.randint(30, 380)
  size = random.randint(8, 18)
  col = random.choice(maple_colors)
  draw4.ellipse([lx - size, ly - size//2, lx + size, ly + size//2], fill=col)
  draw4.ellipse([lx - size//2, ly - size, lx + size//2, ly + size], fill=col)

# Add seal '전문가의 성'
draw_seal(draw4, ["전문", "가성"], 620, 40)

base4.paste(overlay4, (0, 0), overlay4)
optimize_and_save(base4, "world_4")

# 5. Synthesize World 5: Master's League (마스터 리그 - Golden Sun & Ancient Pine)
base5 = img3.copy().resize((720, 1280), Image.Resampling.LANCZOS)
overlay5 = Image.new("RGBA", (720, 1280), (0, 0, 0, 0))
draw5 = ImageDraw.Draw(overlay5)

# Golden majestic sun at horizon
sun_x, sun_y = 360, 260
for r in range(120, 0, -1):
  alpha = int(140 * (1 - r / 120))
  draw5.ellipse([sun_x - r, sun_y - r, sun_x + r, sun_y + r], fill=(235, 145, 35, alpha))
draw5.ellipse([sun_x - 45, sun_y - 45, sun_x + 45, sun_y + 45], fill=(245, 180, 65, 190))

# Golden mist overlay
for y in range(400):
  alpha = int(60 * (1 - y / 400))
  draw5.line([(0, y), (720, y)], fill=(240, 175, 60, alpha))

# Add seal '마스터 리그'
draw_seal(draw5, ["마스", "터극"], 620, 40)

base5.paste(overlay5, (0, 0), overlay5)
optimize_and_save(base5, "world_5")

print("All backgrounds generated and optimized successfully!")
