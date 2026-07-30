import re

filepath = "/Users/huynq/Learn/brief/src/entities/slide/model/mocks.ts"
with open(filepath, 'r') as f:
    content = f.read()

# We want to replace title: "..." with title: "Learner Engagement" inside staticSlides.
# The staticSlides array is the first one.
# An easier way is to just do a string replace, but there's "Dynamic Feed Mode" title.
# So we only replace title and description inside `staticSlides` array.
# The array starts with `export const staticSlides: SlideItem[] = [` and ends with `];`

start_idx = content.find('export const staticSlides: SlideItem[] = [')
end_idx = content.find('];', start_idx)

static_slides_content = content[start_idx:end_idx]

# replace title
static_slides_content = re.sub(r'title:\s*".*?",', 'title: "Learner Engagement",', static_slides_content)

# replace description
static_slides_content = re.sub(r'description:\s*".*?",', 'description: "Interactive learning guide for vertical mobile UI design.",', static_slides_content, flags=re.DOTALL)

content = content[:start_idx] + static_slides_content + content[end_idx:]

with open(filepath, 'w') as f:
    f.write(content)

