import os

with open('qatar/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<summary style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">', '<summary style="padding: 15px; border-bottom: 1px solid var(--inner-border);">')

with open('qatar/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
