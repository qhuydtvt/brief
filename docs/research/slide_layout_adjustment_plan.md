# Slide Layout Adjustment Plan

This plan details the steps to modify the mock data and the layout of the 10 custom slide components so that the main educational content (slide-specific titles and main points) is moved directly into the center viewport screen.

## 1. Update Mock Data (`src/entities/slide/model/mocks.ts`)
* **Goal**: Standardize the presentation title across all slides so the generic overlay shows a consistent presentation title.
* **Action**: Change the `title` attribute for all 10 objects in the `staticSlides` array to `"Learner Engagement"`. 
* **Note**: We will leave the `description` field empty or generic in the mock data, or remove its rendering from the generic overlay, as the specific descriptions will be hardcoded inside the custom components.

## 2. Restructure Custom Slide Components (`src/entities/slide/ui/custom/`)
For each of the 10 custom components, we will wrap the existing interactive elements in a structured layout. We will add a prominent header for the slide-specific title and a text block for the main educational point (previously in the `description` mock data). 

A common layout pattern will be applied:
```tsx
<div className="flex flex-col h-full w-full p-6 pt-12 items-center justify-start gap-8 text-center">
  <div className="space-y-4 max-w-sm">
    <h1 className="text-3xl font-extrabold text-white tracking-tight">Slide Specific Title</h1>
    <p className="text-lg text-white/80 font-medium">Main educational point goes here.</p>
  </div>
  
  <div className="flex-1 w-full flex flex-col items-center justify-center">
    {/* Existing Interactive Component Code (e.g., flip card, quiz, chunking UI) */}
  </div>
</div>
```

### Detailed Component Changes:

1. **SlideLessIsMore.tsx**
   * **Title**: "Less is More"
   * **Main Point**: "Attention is a scarce resource. Ditch text walls and chunk ideas into single takeaways."
   * **Layout**: Place the title and main point at the top. The existing chunking UI (the text box that transforms to bullet points and the "Chunk It!" button) will be centered below.

2. **SlideSeeAndHear.tsx**
   * **Title**: "See and Hear"
   * **Main Point**: "Combine visuals and words. Dual coding builds double the memory pathways in the brain."
   * **Layout**: Title and main point at the top. The image/icon and text pairing interactive elements below.

3. **SlideTestToRemember.tsx**
   * **Title**: "Test to Remember"
   * **Main Point**: "Don't just re-read notes. Force active recall using quick, low-stakes micro-quizzes."
   * **Layout**: Title and main point at the top. The interactive quiz buttons (True/False or multiple choice) below.

4. **SlideSpaceYourPractice.tsx**
   * **Title**: "Space Your Practice"
   * **Main Point**: "Review key ideas right before they fade to cement durable neural pathways."
   * **Layout**: Title and main point at the top. The interactive spacing timeline or calendar UI below.

5. **SlideMakeItPersonal.tsx**
   * **Title**: "Make it Personal"
   * **Main Point**: "Connect facts to real use. We pay attention to what feels directly relevant now."
   * **Layout**: Title and main point at the top. The interactive scenario selector or personalization input below.

6. **SlideDesignForPortrait.tsx**
   * **Title**: "Design for Portrait"
   * **Main Point**: "Place key information in the central focal zone where users naturally look first."
   * **Layout**: Title and main point at the top. The visual heatmap or draggable element demonstrating the focal zone below.

7. **SlideKeepWithinReach.tsx**
   * **Title**: "Keep Within Reach"
   * **Main Point**: "Put action buttons in the bottom third thumb zone for effortless, one-handed taps."
   * **Layout**: Title and main point at the top. The interactive thumb-zone demonstration below.

8. **SlideReadTheSound.tsx**
   * **Title**: "Read the Sound"
   * **Main Point**: "80% of feeds are muted. Sync text overlays with audio to capture eyes instantly."
   * **Layout**: Title and main point at the top. The animated kinetic typography and mute/unmute toggle below.

9. **SlideHookThemFast.tsx**
   * **Title**: "Hook Them Fast"
   * **Main Point**: "Interrupt the scroll feed in the first 3 seconds with sudden visual changes."
   * **Layout**: Title and main point at the top. The 3-second timer and sudden visual pattern interrupt element below.

10. **SlideSwipeAndRepeat.tsx**
    * **Title**: "Frictionless Micro-Flows"
    * **Main Point**: "Keep learners hooked using double-taps, bottom drawers, and seamless loop design."
    * **Layout**: Title and main point at the top. The micro-interaction examples (double tap to like, bottom drawer pull) below.
