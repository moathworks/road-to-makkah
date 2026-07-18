import re

with open('qatar/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_card = False
for i, line in enumerate(lines):
    if i < 550 or i > 670:
        new_lines.append(line)
        continue

    if '<div class="mini-card-dark"' in line:
        line = line.replace('class="mini-card-dark"', 'class="station-card"')
        # Remove inline border-right-color
        line = re.sub(r' style="border-right-color:[^"]+"', '', line)
        in_card = True
        new_lines.append(line)
        new_lines.append('                        <div>\n')
        continue
    
    if in_card:
        if '<h3' in line:
            line = line.replace('<h3', '<h2').replace('</h3>', '</h2>')
        
        if 'btn-maps-mini' in line:
            line = line.replace('btn-maps-mini', 'btn-station-map')
            if 'خريطة 1' in line or 'خريطة 2' in line:
                line = line.replace('class="btn-station-map"', 'class="btn-station-map" style="flex: 1; padding: 10px 5px;"')
        
        line = line.replace('🗺️ الخريطة', '🗺️ موقع المحطة')
        line = line.replace('🗺️ خريطة 1', '🗺️ موقع المحطة 1')
        line = line.replace('🗺️ خريطة 2', '🗺️ موقع المحطة 2')
        
        # Check if we are at the end of the paragraph
        if '</p>' in line:
            new_lines.append(line)
            new_lines.append('                        </div>\n')
            continue
            
        if line.strip() == '</div>' and not 'display:flex' in line:
            # Reached end of the card
            in_card = False
            
    new_lines.append(line)

with open('qatar/index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
