from PIL import Image, ImageDraw
import os
import base64

src_path = r'C:\Users\hp\.gemini\antigravity-ide\brain\64f43ec2-bd4f-4391-9a62-d496beeeb56c\.user_uploaded\media_1790614035459.png'
img = Image.open(src_path).convert('RGBA')

# 1. Save full logo for website Navbar / Footer
os.makedirs('public', exist_ok=True)
img.save('public/logo.png')
print('Saved full logo to public/logo.png')

# 2. Create square version for favicons (512x512)
w, h = img.size
# Create 1024x1024 white background canvas
square = Image.new('RGBA', (w, w), (255, 255, 255, 255))
offset_y = (w - h) // 2
square.paste(img, (0, offset_y), img)

# Resize to 512x512
fav512 = square.resize((512, 512), Image.Resampling.LANCZOS)

# Create rounded corners for squircle tab icon
mask = Image.new('L', (512, 512), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([0, 0, 512, 512], radius=110, fill=255)

fav_final = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
fav_final.paste(fav512, (0, 0), mask)

# Save all favicon formats
fav_final.save('public/favicon.png')
fav_final.save('public/apple-touch-icon.png')
fav_final.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
fav_final.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
fav_final.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

# Also create SVG version linking the base64 PNG
with open('public/favicon.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,{b64}" x="0" y="0" width="512" height="512" />
</svg>'''

with open('public/favicon.svg', 'w') as f:
    f.write(svg_content)

print('Successfully generated all favicons from user uploaded logo!')
