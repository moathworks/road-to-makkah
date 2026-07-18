import os
import re

with open('qatar/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

img_matches = re.finditer(r'<img\s+[^>]*>', content)
modified_content = content
for match in img_matches:
    img_tag = match.group(0)
    if 'loading=\"lazy\"' not in img_tag:
        new_img_tag = img_tag.replace('<img ', '<img loading=\"lazy\" ')
        modified_content = modified_content.replace(img_tag, new_img_tag)

font_tag = '<link href=\"https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap\"'
new_font_tag = '<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\"https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap\"'
modified_content = modified_content.replace(font_tag, new_font_tag)

with open('qatar/index.html', 'w', encoding='utf-8') as f:
    f.write(modified_content)
print('Optimized images and fonts.')
