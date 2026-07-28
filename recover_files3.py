import re
import json

transcript_path = "/Users/huynq/.gemini/antigravity-cli/brain/78179576-589d-48af-9577-ff563420cd66/.system_generated/logs/transcript_full.jsonl"

with open(transcript_path, "r") as f:
    content = f.read()

import json
for line in content.split('\n'):
    if not line: continue
    try:
        data = json.loads(line)
        if "toolCall" in data:
            call = data["toolCall"]
            func_name = call["function"]["name"]
            if "write_to_file" in func_name:
                args = json.loads(call["function"]["arguments"])
                target = args.get("TargetFile", "")
                fn = target.split('/')[-1]
                print(f"Recovered {fn}")
                with open(f"/Users/huynq/Learn/brief/src/entities/slide/ui/custom/{fn}", "w") as out:
                    out.write(args["CodeContent"])
    except:
        pass
