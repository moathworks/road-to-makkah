import re

with open('qatar/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out = []
in_stations_section = False
for i, line in enumerate(lines):
    if '<!-- محطات الوقود والراحة بالتفصيل -->' in line:
        out.append(line)
        out.append('<h2 class="section-title" style="text-align: center; margin: 30px 0 20px 0; color: var(--gold); font-size: 1.25rem;">⛽ محطات الوقود والراحة بالتفصيل</h2>\n')
        continue
    if 500 <= i <= 506:
        continue
    if 748 <= i <= 749: # the closing div and details
        continue

    line_lower = line.lower()
    if 'class="custom-accordion riyadh-group-dark"' in line_lower:
        line = line.replace('class="custom-accordion riyadh-group-dark"', 'class="custom-accordion"')
        # remove inline styles
        line = re.sub(r' style="[^"]*"', '', line)
    
    # Check if this line is the summary of the nested accordions
    if '<summary ' in line and 'padding: 15px' in line:
        line = '            <summary>\n'
    
    # Check for the h3 title
    if '<h3 ' in line and 'محطات' in line:
        # Extract text and replace h3 with span
        text = line.split('>')[-2].split('</')[0]
        # if no emoji at start, add one
        if not any(e in text for e in ['⛽', '🛣️', '🔄', '🕋']):
            if 'قبل الرياض' in text: text = '⛽ ' + text
            elif '80 السريع' in text: text = '🛣️ ' + text
            elif 'التفافي' in text: text = '🔄 ' + text
            elif 'بعد الرياض' in text: text = '🕋 ' + text
        line = f'                <span>{text}</span>\n'
        
    if '<div class="accordion-content" style="padding: 15px;">' in line:
        line = '            <div class="accordion-content">\n'
        
    out.append(line)

with open('qatar/index.html', 'w', encoding='utf-8') as f:
    f.writelines(out)
print('Done!')
