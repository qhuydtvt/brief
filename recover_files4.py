import json

transcript_path = "/Users/huynq/.gemini/antigravity-cli/brain/78179576-589d-48af-9577-ff563420cd66/.system_generated/logs/transcript_full.jsonl"

def extract_from_dict(d):
    if isinstance(d, dict):
        if "name" in d and ("write_to_file" in d["name"]):
            args = d.get("args", {})
            if isinstance(args, str):
                try:
                    args = json.loads(args)
                except:
                    pass
            if "TargetFile" in args and "CodeContent" in args:
                target = args["TargetFile"]
                fn = target.split('/')[-1]
                print(f"Recovered {fn}")
                with open(f"/Users/huynq/Learn/brief/src/entities/slide/ui/custom/{fn}", "w") as out:
                    out.write(args["CodeContent"])
        for k, v in d.items():
            extract_from_dict(v)
    elif isinstance(d, list):
        for item in d:
            extract_from_dict(item)

with open(transcript_path, "r") as f:
    for line in f:
        try:
            data = json.loads(line)
            extract_from_dict(data)
        except Exception as e:
            pass
