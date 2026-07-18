import urllib.request
import re
import os

req = urllib.request.Request('https://play.google.com/store/apps/details?id=sa.gov.moi.os.mobile', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    match = re.search(r'\"(https://play-lh\.googleusercontent\.com/[^\"]+)\"', html)
    if match:
        img_url = match.group(1)
        print('Found URL:', img_url)
        req2 = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req2) as resp2, open('assets/images/absher.png', 'wb') as out_file:
            out_file.write(resp2.read())
        print('Downloaded absher.png')
        
        with open('qatar/index.html', 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('../assets/images/absher.svg', '../assets/images/absher.png')
        content = content.replace('https://www.absher.sa/portal/individuals/assets/images/absher_logo.svg', '../assets/images/absher.png')
        with open('qatar/index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated HTML')
    else:
        print('Not found')
except Exception as e:
    print(f'Failed: {e}')
