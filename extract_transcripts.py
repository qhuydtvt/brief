import os
import json
import re

directories = [
    "/Users/huynq/.gemini/antigravity-cli/brain/06d0023d-19f5-41f7-acc8-b293b959cde8",
    "/Users/huynq/.gemini/antigravity-cli/brain/0212fc64-6512-40d6-a808-4ef5bfc9e863",
    "/Users/huynq/.gemini/antigravity-cli/brain/78179576-589d-48af-9577-ff563420cd66"
]

files = [
    "SlideHookThemFast.tsx",
    "SlideReadTheSound.tsx",
    "SlideSpaceYourPractice.tsx",
    "SlideTestToRemember.tsx"
]

for d in directories:
    t_path = os.path.join(d, ".system_generated", "logs", "transcript.jsonl")
    if os.path.exists(t_path):
        with open(t_path, "r") as f:
            lines = f.readlines()
            for line in lines:
                for file in files:
                    if file in line and "export function" in line:
                        print(f"Found in {d}, file {file}")
                        # attempt to extract the source
                        try:
                            data = json.loads(line)
                            # it could be in tool response or content
                            if 'output' in str(data):
                                pass # hard to parse blindly
                        except:
                            pass
