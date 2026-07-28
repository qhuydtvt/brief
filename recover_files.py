import json

transcript_path = "/Users/huynq/.gemini/antigravity-cli/brain/78179576-589d-48af-9577-ff563420cd66/.system_generated/logs/transcript.jsonl"
files_to_recover = [
    "SlideHookThemFast.tsx",
    "SlideReadTheSound.tsx",
    "SlideSpaceYourPractice.tsx",
    "SlideTestToRemember.tsx"
]

with open(transcript_path, "r") as f:
    for line in f:
        try:
            data = json.loads(line)
            # Find write_to_file tool calls
            if "toolCall" in data:
                call = data["toolCall"]
                if call["function"]["name"] == "default_api:write_to_file":
                    args = json.loads(call["function"]["arguments"])
                    target_file = args.get("TargetFile", "")
                    for file_name in files_to_recover:
                        if target_file.endswith(file_name):
                            code = args.get("CodeContent", "")
                            out_path = f"/Users/huynq/Learn/brief/src/entities/slide/ui/custom/{file_name}"
                            with open(out_path, "w") as out_f:
                                out_f.write(code)
                            print(f"Recovered {file_name}")
        except Exception as e:
            pass

