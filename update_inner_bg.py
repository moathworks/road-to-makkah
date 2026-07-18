import os

with open('qatar/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('--card-border: rgba(255, 255, 255, 0.05);', '--card-border: rgba(255, 255, 255, 0.05);\n            --inner-bg: rgba(255, 255, 255, 0.03);')
content = content.replace('--card-border: rgba(0, 0, 0, 0.08);', '--card-border: rgba(0, 0, 0, 0.08);\n            --inner-bg: #fafafa;')
content = content.replace('background: var(--card-border);', 'background: var(--inner-bg);')

with open('qatar/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html")
