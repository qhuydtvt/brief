import os
import re

components_dir = "/Users/huynq/Learn/brief/src/entities/slide/ui/custom"

slides_data = {
    "SlideLessIsMore.tsx": {
        "title": "Less is More",
        "desc": "Attention is a scarce resource. Ditch text walls and chunk ideas into single takeaways."
    },
    "SlideSeeAndHear.tsx": {
        "title": "See and Hear",
        "desc": "Combine visuals and words. Dual coding builds double the memory pathways in the brain."
    },
    "SlideTestToRemember.tsx": {
        "title": "Test to Remember",
        "desc": "Don't just re-read notes. Force active recall using quick, low-stakes micro-quizzes."
    },
    "SlideSpaceYourPractice.tsx": {
        "title": "Space Your Practice",
        "desc": "Review key ideas right before they fade to cement durable neural pathways."
    },
    "SlideMakeItPersonal.tsx": {
        "title": "Make it Personal",
        "desc": "Connect facts to real use. We pay attention to what feels directly relevant now."
    },
    "SlideDesignForPortrait.tsx": {
        "title": "Design for Portrait",
        "desc": "Place key information in the central focal zone where users naturally look first."
    },
    "SlideKeepWithinReach.tsx": {
        "title": "Keep Within Reach",
        "desc": "Put action buttons in the bottom third thumb zone for effortless, one-handed taps."
    },
    "SlideReadTheSound.tsx": {
        "title": "Read the Sound",
        "desc": "80% of feeds are muted. Sync text overlays with audio to capture eyes instantly."
    },
    "SlideHookThemFast.tsx": {
        "title": "Hook Them Fast",
        "desc": "Interrupt the scroll feed in the first 3 seconds with sudden visual changes."
    },
    "SlideSwipeAndRepeat.tsx": {
        "title": "Swipe and Repeat",
        "desc": "Keep learners hooked using double-taps, bottom drawers, and seamless loop design."
    }
}

def replace_return(content, data):
    header = f"""<div className="flex flex-col h-full w-full justify-start items-center p-4 pt-10 text-center gap-6 select-none">
      <div className="space-y-2 max-w-xs">
        <h3 className="text-2xl font-black text-white tracking-tight">{data["title"]}</h3>
        <p className="text-[13px] text-white/70 font-medium leading-relaxed">
          {data["desc"]}
        </p>
      </div>
      
      <div className="flex-1 w-full flex flex-col items-center justify-center">"""
      
    # match the main return
    match = re.search(r'\n  return \(\n(.*?)\n  \);\n\}', content, re.DOTALL)
    if not match:
        match = re.search(r'\n  return \((.*?)\n  \);\n\}', content, re.DOTALL)
        
    if match:
        inner_content = match.group(1)
        new_content = content[:match.start()] + f"\n  return (\n    {header}\n      {inner_content}\n      </div>\n    </div>\n  );\n}}"
        return new_content
    else:
        print("COULD NOT MATCH", data['title'])
    return content

for filename, data in slides_data.items():
    filepath = os.path.join(components_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
            
        new_content = replace_return(content, data)
        with open(filepath, 'w') as f:
            f.write(new_content)

