import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

OUT_DIR = "/Users/kobujang/Desktop/cording/my-love-sudoku/public/assets/logo"
os.makedirs(OUT_DIR, exist_ok=True)

# High-resolution canvas for crisp display on Retina screens
WIDTH = 840
HEIGHT = 260

# Palette
INK_BLACK = (28, 25, 27, 255)
ROSE_RED = (205, 48, 78, 255)
SEAL_RED = (195, 36, 42, 255)
GOLD_ACCENT = (190, 140, 50, 255)
MUTED_INK = (95, 82, 78, 240)
HALO_WHITE = (255, 255, 255, 180)

# Fonts
FONT_MAIN_TITLE = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleMyungjo.ttf", 64)
FONT_LOVE = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleMyungjo.ttf", 60)
FONT_SUB_KR = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleMyungjo.ttf", 17)
FONT_SUB_EN = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleGothic.ttf", 13)
FONT_SEAL = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleMyungjo.ttf", 16)
FONT_SEAL_BIG = ImageFont.truetype("/System/Library/Fonts/Supplemental/AppleMyungjo.ttf", 20)

def create_title_logo(dark_mode=False):
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    
    # 1. Overlay cherry blossom branch on top-left
    if os.path.exists("/tmp/cherry_branch_alpha.png"):
        branch = Image.open("/tmp/cherry_branch_alpha.png").convert("RGBA")
        branch_resized = branch.resize((190, 190), Image.Resampling.LANCZOS)
        # Position so it drapes from top-left over the first syllable
        canvas.paste(branch_resized, (-20, -25), branch_resized)
        
        # Add a couple of floating sakura petals
        petal = branch_resized.crop((85, 95, 120, 130)).resize((22, 22))
        canvas.paste(petal, (650, 45), petal)
        petal2 = branch_resized.crop((110, 60, 140, 90)).resize((18, 18))
        canvas.paste(petal2, (720, 110), petal2)
    
    # Text layer for rendering glowing halo
    text_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(text_layer)
    
    # Text coordinates
    # We lay out: [내사랑] (Rose-Red calligraphy) + [스도쿠] (Ink-Black calligraphy) + [붉은 도장]
    # Let's measure positions
    center_y = 100
    
    # Text parts
    t_love = "내사랑 "
    t_sudoku = "스도쿠"
    
    # Let's calculate total width to center it nicely
    # We want text center around X=420
    love_bbox = t_draw.textbbox((0, 0), t_love, font=FONT_MAIN_TITLE)
    sudoku_bbox = t_draw.textbbox((0, 0), t_sudoku, font=FONT_MAIN_TITLE)
    
    love_w = love_bbox[2] - love_bbox[0]
    sudoku_w = sudoku_bbox[2] - sudoku_bbox[0]
    seal_gap = 16
    seal_size = 46
    
    total_w = love_w + sudoku_w + seal_gap + seal_size
    start_x = (WIDTH - total_w) // 2 + 10 # slightly offset for cherry branch
    
    love_x = start_x
    sudoku_x = start_x + love_w
    seal_x = sudoku_x + sudoku_w + seal_gap
    seal_y = center_y - 28
    
    # Colors depending on mode
    love_color = (235, 75, 105, 255) if dark_mode else (205, 45, 75, 255)
    sudoku_color = (245, 245, 248, 255) if dark_mode else (26, 24, 25, 255)
    sub_kr_color = (205, 200, 195, 240) if dark_mode else (85, 75, 70, 240)
    sub_en_color = (190, 150, 75, 255) if dark_mode else (175, 125, 40, 255)
    
    # 2. Draw Halo / Shadow for readability
    halo_color = (0, 0, 0, 200) if dark_mode else (255, 255, 255, 220)
    for dx in range(-4, 5):
        for dy in range(-4, 5):
            if abs(dx) + abs(dy) <= 5 and (dx != 0 or dy != 0):
                t_draw.text((love_x + dx, center_y + dy), t_love, fill=halo_color, font=FONT_MAIN_TITLE, anchor="lm")
                t_draw.text((sudoku_x + dx, center_y + dy), t_sudoku, fill=halo_color, font=FONT_MAIN_TITLE, anchor="lm")

    # 3. Draw Main Texts
    t_draw.text((love_x, center_y), t_love, fill=love_color, font=FONT_MAIN_TITLE, anchor="lm")
    t_draw.text((sudoku_x, center_y), t_sudoku, fill=sudoku_color, font=FONT_MAIN_TITLE, anchor="lm")
    
    # 4. Korean Red Seal Stamp [愛] or [정심]
    # Red background
    t_draw.rectangle([seal_x, seal_y, seal_x + seal_size, seal_y + seal_size], outline=SEAL_RED, width=3)
    t_draw.rectangle([seal_x + 3, seal_y + 3, seal_x + seal_size - 3, seal_y + seal_size - 3], outline=(225, 100, 100, 255), width=1)
    t_draw.rectangle([seal_x + 4, seal_y + 4, seal_x + seal_size - 4, seal_y + seal_size - 4], fill=(255, 240, 242, 250))
    t_draw.text((seal_x + seal_size // 2, seal_y + seal_size // 2), "愛", fill=SEAL_RED, font=FONT_SEAL_BIG, anchor="mm")

    # 5. Traditional Decorative Underline & Motto
    divider_y = center_y + 48
    line_left = start_x - 10
    line_right = seal_x + seal_size + 10
    
    # Thin elegant divider lines with center diamond
    t_draw.line([(line_left, divider_y), (WIDTH // 2 - 25, divider_y)], fill=(195, 145, 60, 180), width=1)
    t_draw.line([(WIDTH // 2 + 25, divider_y), (line_right, divider_y)], fill=(195, 145, 60, 180), width=1)
    t_draw.text((WIDTH // 2, divider_y), "✿", fill=love_color, font=FONT_SUB_KR, anchor="mm")
    
    # Korean & English Subtitle
    t_draw.text((WIDTH // 2, divider_y + 24), "한 칸의 몰입 · 마음의 쉼표", fill=sub_kr_color, font=FONT_SUB_KR, anchor="mm")
    t_draw.text((WIDTH // 2, divider_y + 48), "—  M Y   L O V E   S U D O K U  —", fill=sub_en_color, font=FONT_SUB_EN, anchor="mm")
    
    # Composite text onto canvas
    canvas = Image.alpha_composite(canvas, text_layer)
    return canvas

# Generate Light & Dark versions
logo_light = create_title_logo(dark_mode=False)
logo_dark = create_title_logo(dark_mode=True)

# Save WebP and PNG
p_light_webp = os.path.join(OUT_DIR, "title_logo.webp")
p_light_png = os.path.join(OUT_DIR, "title_logo.png")
p_dark_webp = os.path.join(OUT_DIR, "title_logo_dark.webp")
p_dark_png = os.path.join(OUT_DIR, "title_logo_dark.png")

logo_light.save(p_light_webp, format="WEBP", quality=90, method=6)
logo_light.save(p_light_png, format="PNG", optimize=True)
logo_dark.save(p_dark_webp, format="WEBP", quality=90, method=6)
logo_dark.save(p_dark_png, format="PNG", optimize=True)

print(f"Generated title logos in {OUT_DIR}:")
print(f"title_logo.webp ({os.path.getsize(p_light_webp)} bytes)")
print(f"title_logo.png ({os.path.getsize(p_light_png)} bytes)")
print(f"title_logo_dark.webp ({os.path.getsize(p_dark_webp)} bytes)")
print(f"title_logo_dark.png ({os.path.getsize(p_dark_png)} bytes)")
