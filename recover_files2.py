import re

transcript_path = "/Users/huynq/.gemini/antigravity-cli/brain/78179576-589d-48af-9577-ff563420cd66/.system_generated/logs/transcript_full.jsonl"
files_to_recover = [
    "SlideHookThemFast.tsx",
    "SlideReadTheSound.tsx",
    "SlideSpaceYourPractice.tsx",
    "SlideTestToRemember.tsx"
]

with open(transcript_path, "r") as f:
    content = f.read()

import json
for line in content.split('\n'):
    if not line: continue
    try:
        data = json.loads(line)
        # check toolCall
        if "toolCall" in data:
            call = data["toolCall"]
            if call["function"]["name"] == "default_api:write_to_file":
                args = json.loads(call["function"]["arguments"])
                target = args.get("TargetFile", "")
                for fn in files_to_recover:
                    if target.endswith(fn):
                        print(f"Recovered {fn}")
                        with open(f"/Users/huynq/Learn/brief/src/entities/slide/ui/custom/{fn}", "w") as out:
                            out.write(args["CodeContent"])
    except:
        pass
