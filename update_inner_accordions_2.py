import os

with open('qatar/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# For the 3 already replaced accordions:
old_inner_style_1 = 'style="padding: 0; margin: 15px auto 0 auto; width: 95%; border-color: rgba(255,255,255,0.05); background: var(--card-border); border-radius: 8px;"'
new_inner_style_1 = 'style="padding: 0; margin: 15px auto 15px auto; width: 95%; border-color: rgba(255,255,255,0.05); background: var(--card-border); border-radius: 8px;"'
content = content.replace(old_inner_style_1, new_inner_style_1)

# For the "مسار التفافي" accordion:
old_bypass_style = 'style="margin-top: 15px; border-color: rgba(212, 175, 55, 0.3); background: rgba(212, 175, 55, 0.02);"'
new_bypass_style = 'style="padding: 0; margin: 15px auto 15px auto; width: 95%; border-color: rgba(212, 175, 55, 0.3); background: rgba(212, 175, 55, 0.02); border-radius: 8px;"'
content = content.replace(old_bypass_style, new_bypass_style)

with open('qatar/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated inner accordions margins and bypass route width.')
