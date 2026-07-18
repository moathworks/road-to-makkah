with open("qatar/index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()
depth = 0
for i, line in enumerate(lines):
    lower_line = line.lower()
    if "<div" in lower_line:
        depth += lower_line.count("<div")
    if "</div" in lower_line:
        depth -= lower_line.count("</div")
    if "details.custom-accordion" in lower_line or "<details" in lower_line:
        print(f"Line {i+1} depth {depth}: {line.strip()[:60]}")
