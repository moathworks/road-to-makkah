import os

with open('qatar/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix CSS for the chevron rotation
old_css = "details.custom-accordion[open] .chevron-icon {"
new_css = "details.custom-accordion[open] > summary .chevron-icon {"
content = content.replace(old_css, new_css)

# 2. Fix the inner accordions background and width
old_inner_style = 'style="padding: 0; margin-top: 15px; border-color: rgba(255,255,255,0.05); background: transparent;"'
new_inner_style = 'style="padding: 0; margin: 15px auto 0 auto; width: 95%; border-color: rgba(255,255,255,0.05); background: rgba(0, 0, 0, 0.2); border-radius: 8px;"'
content = content.replace(old_inner_style, new_inner_style)

with open('qatar/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated CSS and inner accordion styles.')
