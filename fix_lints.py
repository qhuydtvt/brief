import os
import re

components_dir = "/Users/huynq/Learn/brief/src/entities/slide/ui/custom"

for fn in os.listdir(components_dir):
    if fn.endswith(".tsx"):
        path = os.path.join(components_dir, fn)
        with open(path, "r") as f:
            content = f.read()
        
        # fix { slide } to { slide: _slide }
        content = re.sub(r'{\s*slide\s*}:', '{ slide: _slide }:', content)
        # fix unused imports by just removing them or ignoring them. We can just add // @ts-nocheck to top of files, or remove them
        # Let's just fix the specific ones
        if "SlideDesignForPortrait" in fn:
            content = content.replace('import { useState, useRef, useEffect }', 'import { useState, useRef }')
        if "SlideSpaceYourPractice" in fn:
            content = content.replace('Battery, ', '').replace(', BatteryWarning', '')
        
        with open(path, "w") as f:
            f.write(content)

# fix SlideCard.tsx
card_path = "/Users/huynq/Learn/brief/src/entities/slide/ui/SlideCard.tsx"
with open(card_path, "r") as f:
    content = f.read()
content = content.replace('\n  mode,', '\n  mode: _mode,')
with open(card_path, "w") as f:
    f.write(content)
