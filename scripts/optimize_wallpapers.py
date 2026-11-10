#!/usr/bin/env python3
"""
Mobile-Optimized Wallpaper & Background Generator for '내사랑 스도쿠'
Processes authentic Korean Minhwa / ink-wash paintings provided by user.
Outputs lightweight, retina-ready WebP and progressive JPEG files.
"""

import os
import glob
from PIL import Image

def optimize_image(src_path, dest_webp, dest_jpg, target_width=640, quality=75):
    with Image.open(src_path) as img:
        img = img.convert('RGB')
        w, h = img.size
        target_height = int(h * (target_width / w))
        resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        
        # Save WebP
        resized.save(dest_webp, 'WEBP', quality=quality, method=6)
        # Save Progressive JPEG fallback
        resized.save(dest_jpg, 'JPEG', quality=quality, optimize=True, progressive=True)
        
        webp_size = os.path.getsize(dest_webp)
        jpg_size = os.path.getsize(dest_jpg)
        return webp_size, jpg_size

def main():
    src_folders = glob.glob('/Users/kobujang/Desktop/*11*')
    if not src_folders:
        raise RuntimeError("Attached wallpaper folder not found on Desktop!")
    src_folder = src_folders[0]
    print(f"Reading from source folder: {src_folder}")
    
    files = sorted(os.listdir(src_folder))
    print(f"Total source images: {len(files)}")
    
    # Categorize
    flower_files = [f for f in files if any(w in f.lower() for w in ['flower', 'blooming'])]
    landscape_files = [f for f in files if any(w in f.lower() for w in ['landscape', 'minhwa-style_landscape', 'painter_studio', 'korean_ink_wash_painting', 'korean_ink_wash_background'])]
    palace_market_files = [f for f in files if any(w in f.lower() for w in ['palace', 'market', 'traditional_market'])]
    busan_beach_files = [f for f in files if any(w in f.lower() for w in ['busan', 'beach'])]
    seoul_city_files = [f for f in files if any(w in f.lower() for w in ['seoul', 'city', 'gangnam', 'urban', 'downtown']) and f not in busan_beach_files]
    other_files = [f for f in files if f not in set(flower_files + landscape_files + palace_market_files + busan_beach_files + seoul_city_files)]
    
    # 5 Worlds x 10 Stages = 50 Stages
    world_stages = {
        1: flower_files[:10],
        2: landscape_files[:10],
        3: palace_market_files + other_files + [busan_beach_files[0]],
        4: busan_beach_files[1:11],
        5: seoul_city_files[:10]
    }
    
    wallpapers_dir = os.path.abspath('my-love-sudoku/public/assets/wallpapers')
    backgrounds_dir = os.path.abspath('my-love-sudoku/public/assets/backgrounds')
    os.makedirs(wallpapers_dir, exist_ok=True)
    os.makedirs(backgrounds_dir, exist_ok=True)
    
    total_orig_size = 0
    total_opt_webp_size = 0
    total_opt_jpg_size = 0
    
    stage_id = 1
    for world_id in range(1, 6):
        stages = world_stages[world_id]
        print(f"\n--- Processing World {world_id} ({len(stages)} stages) ---")
        for i, filename in enumerate(stages):
            src_path = os.path.join(src_folder, filename)
            orig_sz = os.path.getsize(src_path)
            total_orig_size += orig_sz
            
            dest_webp = os.path.join(wallpapers_dir, f"stage_{stage_id}.webp")
            dest_jpg = os.path.join(wallpapers_dir, f"stage_{stage_id}.jpg")
            
            w_sz, j_sz = optimize_image(src_path, dest_webp, dest_jpg)
            total_opt_webp_size += w_sz
            total_opt_jpg_size += j_sz
            
            print(f"  Stage {stage_id:02d} ({filename[:28]}...): Orig {orig_sz//1024}KB -> WebP {w_sz//1024}KB, JPG {j_sz//1024}KB")
            stage_id += 1
            
        # Also copy world default wallpaper
        world_src = os.path.join(src_folder, stages[0])
        w_webp = os.path.join(wallpapers_dir, f"world_{world_id}.webp")
        w_jpg = os.path.join(wallpapers_dir, f"world_{world_id}.jpg")
        optimize_image(world_src, w_webp, w_jpg)
        
        # Backwards compatibility in backgrounds/
        b_webp = os.path.join(backgrounds_dir, f"world_{world_id}.webp")
        b_jpg = os.path.join(backgrounds_dir, f"world_{world_id}.jpg")
        optimize_image(world_src, b_webp, b_jpg)
        
        # Clean zen_sheet_level_*.webp and .jpg (WITHOUT ANY GRID LINES!)
        z_webp = os.path.join(backgrounds_dir, f"zen_sheet_level_{world_id}.webp")
        z_jpg = os.path.join(backgrounds_dir, f"zen_sheet_level_{world_id}.jpg")
        optimize_image(world_src, z_webp, z_jpg)

    # Home background
    home_src = os.path.join(src_folder, flower_files[0])
    h_webp = os.path.join(wallpapers_dir, "home_bg.webp")
    h_jpg = os.path.join(wallpapers_dir, "home_bg.jpg")
    optimize_image(home_src, h_webp, h_jpg)
    optimize_image(home_src, os.path.join(backgrounds_dir, "home_bg.webp"), os.path.join(backgrounds_dir, "home_bg.jpg"))

    print("\n================ Optimization Summary ================")
    print(f"Original total size: {total_orig_size // (1024*1024)} MB ({total_orig_size // 1024} KB)")
    print(f"Optimized WebP total size: {total_opt_webp_size // 1024} KB (Avg {total_opt_webp_size // 50 // 1024} KB per stage)")
    print(f"Optimized JPG total size: {total_opt_jpg_size // 1024} KB (Avg {total_opt_jpg_size // 50 // 1024} KB per stage)")
    reduction = ((total_orig_size - total_opt_webp_size) / total_orig_size) * 100
    print(f"Bandwidth Reduction: {reduction:.1f}% savings! 🚀")
    print("======================================================")

if __name__ == '__main__':
    main()
