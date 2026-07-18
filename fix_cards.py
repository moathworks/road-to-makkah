import re

with open('qatar/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We need to target the two sections with class="riyadh-inner-grid"
# and change the cards inside them.

def process_card(match):
    # match.group(0) is the entire card HTML.
    card = match.group(0)
    
    # Replace class
    card = re.sub(r'class="mini-card-dark"[^>]*>', 'class="station-card">', card)
    
    # Change h3 to h2
    card = card.replace('<h3', '<h2').replace('</h3>', '</h2>')
    
    # Wrap h2 and p in a div
    # The structure usually is:
    # <div class="station-card">
    # <h3>...</h3>
    # <p>...</p>
    # <a ...> or <div style="display:flex...">
    # We can inject <div> before <h2> and </div> after </p>
    
    # Find the end of </p>
    p_end_idx = card.find('</p>') + 4
    h2_start_idx = card.find('<h2')
    if p_end_idx > 3 and h2_start_idx > 0:
        card = card[:h2_start_idx] + '<div>\n' + card[h2_start_idx:p_end_idx] + '\n</div>' + card[p_end_idx:]

    # Replace button classes
    card = card.replace('btn-maps-mini', 'btn-station-map')
    
    # Replace map texts
    card = card.replace('🗺️ الخريطة', '🗺️ موقع المحطة')
    card = card.replace('🗺️ خريطة 1', '🗺️ موقع المحطة 1')
    card = card.replace('🗺️ خريطة 2', '🗺️ موقع المحطة 2')
    
    # If there is a flex container for buttons, we can add flex:1 to the buttons so they fill
    if 'display:flex; gap:6px;' in card:
        card = card.replace('class="btn-station-map"', 'class="btn-station-map" style="flex: 1; text-align: center; padding: 10px 5px;"')

    return card

# Find all cards
# A card starts with <div class="mini-card-dark" and ends with its closing </div>
# Since there are no nested divs inside mini-card-dark other than the button flex container, we can carefully use regex.
# Actually, wait. Some have <div style="display:flex; gap:6px; margin-top:auto;">...</div> inside them!
# So a simple regex might be tricky. Let's do it by parsing or manually splitting.

# Splitting by <div class="mini-card-dark"
parts = re.split(r'(<div class="mini-card-dark".*?>)', html)

new_html = ""
for i in range(len(parts)):
    if parts[i].startswith('<div class="mini-card-dark"'):
        # This is the start of a card. The actual content of the card is in parts[i+1]
        pass # we will process it in the next step
    else:
        if i > 0 and parts[i-1].startswith('<div class="mini-card-dark"'):
            # This is the content of the card. It ends at the last </div> before the next section.
            # But wait, parts[i] contains everything up to the NEXT <div class="mini-card-dark".
            # We need to find the matching closing </div> for this card.
            pass

# Since Python regex for nested tags is hard, let's just use string replacement on known blocks.
