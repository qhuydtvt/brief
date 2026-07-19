# Slide Interaction Proposals

Based on the [Mobile UX & Attention Retention Research Report](file:///Users/huynq/Learn/brief/docs/research/mobile_ux_and_retention_research.md) and the [Slide Curriculum Definitions](file:///Users/huynq/Learn/brief/src/entities/slide/model/mocks.ts), here are custom interaction proposals tailored to the specific learning point of each slide.

## Slide 1: Less is More
*   **Slide Topic & Rationale**: Focuses on reducing cognitive load by ditching text walls. We want the user to actively experience the relief of chunking.
*   **Custom Layout & Visuals**: An initial cluttered "wall of text" graphic that looks overwhelming.
*   **User Touch Interaction**: A central "Chunk It!" button. Tapping it triggers an animation where the text wall shatters and reorganizes into three clean, spaced-out, large-font bullet points.
*   **Code Implementation Outline**: Use a React `useState` (`isChunked`). When false, render a dense block of text with small line height. When true, use Tailwind classes like `transition-all duration-500 ease-spring` to space them out with `gap-6` and `text-2xl`.

## Slide 2: See and Hear
*   **Slide Topic & Rationale**: Demonstrates dual coding (combining visuals and words).
*   **Custom Layout & Visuals**: A split screen or a flashcard UI. One side shows just a word ("Apple"), the other shows a picture of an apple.
*   **User Touch Interaction**: A swipeable divider (slider) or a 3D flip interaction on tap. Dragging the slider merges the two halves to show the word and image together.
*   **Code Implementation Outline**: Use Framer Motion or Tailwind's `group-hover:rotate-y-180` for a flip effect. If a slider, use a controlled input `type="range"` mapping to the `clip-path` or width of an overlapping `div`.

## Slide 3: Test to Remember
*   **Slide Topic & Rationale**: Active recall and low-stakes micro-quizzes.
*   **Custom Layout & Visuals**: A bold question presented in the central focal zone with two large, tap-friendly choice buttons below it.
*   **User Touch Interaction**: The user must tap one of the answers. On selection, the button flashes green (correct) or red (incorrect) with a brief haptic-style visual shake.
*   **Code Implementation Outline**: React state `selectedAnswer`. Use Tailwind classes `active:scale-95` for the tap bounce. If wrong, apply an `animate-shake` utility class. 

## Slide 4: Space Your Practice
*   **Slide Topic & Rationale**: Spaced repetition and memory decay over time.
*   **Custom Layout & Visuals**: A glowing "Memory Strength" gauge (battery or progress bar) that slowly depletes. 
*   **User Touch Interaction**: A "Review Now" button. Tapping it refills the gauge instantly, and the depletion rate slows down slightly on subsequent taps to simulate durable neural pathways.
*   **Code Implementation Outline**: Use a React `useEffect` with `setInterval` to decrease a `memoryLevel` state. Use a Tailwind progress bar (`w-[${memoryLevel}%]`).

## Slide 5: Make it Personal
*   **Slide Topic & Rationale**: Connecting facts to relevance.
*   **Custom Layout & Visuals**: A Mad-Libs style sentence or a tag selector: "I want to learn for [Work] [Hobby] [Exams]".
*   **User Touch Interaction**: User taps a pill-shaped tag. The surrounding slide context (background color, background icon, and example text) instantly updates to match the selection.
*   **Code Implementation Outline**: State `activePersona`. Render different content blocks conditionally. Use Tailwind `transition-colors duration-300` on the container to smoothly shift the background gradient.

## Slide 6: Design for Portrait
*   **Slide Topic & Rationale**: Central focal zone bias (users focus on the middle 30-70% height).
*   **Custom Layout & Visuals**: The screen is darkened with a semi-transparent overlay, except for a bright rectangular cutout in the middle third of the screen.
*   **User Touch Interaction**: A movable text block starts in the dark top zone. The user drags the block into the highlighted central zone, which causes it to light up and pulse.
*   **Code Implementation Outline**: Implement drag using a library like `react-use-gesture` or Framer Motion's `drag` prop. Check if the block's Y coordinate falls between 30% and 70% of `window.innerHeight`.

## Slide 7: Keep Within Reach
*   **Slide Topic & Rationale**: The thumb zone (bottom right third is ideal for one-handed reach).
*   **Custom Layout & Visuals**: A heat map overlay showing the bottom-right as green (easy), middle as yellow (stretch), top as red (hard).
*   **User Touch Interaction**: A CTA button is initially placed in the top-left "red" zone. The user is prompted to tap it, but it moves away playfully until they tap a toggle to "Fix Layout", which snaps the button into the green thumb zone.
*   **Code Implementation Outline**: Tailwind absolute positioning. Initial state: `top-4 left-4`. "Fixed" state: `bottom-24 right-4` (accounting for safe areas).

## Slide 8: Read the Sound
*   **Slide Topic & Rationale**: Kinetic typography for muted feeds.
*   **Custom Layout & Visuals**: A dynamic text display in the upper-middle third. 
*   **User Touch Interaction**: A pulsing "Unmute / Play" button. When tapped, a sequence of 3-4 words pops onto the screen in rapid succession, scaling up and fading out, simulating spoken rhythm.
*   **Code Implementation Outline**: Use a timed sequence of state updates or CSS keyframe animations (`animate-pop-in`). Words map to array indices revealed sequentially over 1500ms.

## Slide 9: Hook Them Fast
*   **Slide Topic & Rationale**: Pattern interrupt to break the hypnotic scroll trance.
*   **Custom Layout & Visuals**: Starts looking like a standard, slightly boring slide card.
*   **User Touch Interaction**: After exactly 2 seconds of viewing, or upon the user's first scroll attempt, a sudden visual disruption occurs—the background color inverted, the text scales up 150%, and the angle tilts slightly.
*   **Code Implementation Outline**: React `useEffect` `setTimeout` for 2000ms. State `isHooked`. When true, apply Tailwind classes like `scale-150 -rotate-3 invert` combined with `transition-transform duration-200`.

## Slide 10: Swipe and Repeat
*   **Slide Topic & Rationale**: Frictionless interaction loops and variable rewards.
*   **Custom Layout & Visuals**: A sandbox environment featuring a dummy feed post.
*   **User Touch Interaction**: 
63. Double-tap the screen to trigger a floating heart animation at the tap coordinates.
64. Swipe up from a bottom indicator to pull up a "frictionless drawer" covering 60% of the screen.
*   **Code Implementation Outline**: 
    *   **Double tap**: Custom touch handler tracking time between `onTouchStart` events (< 300ms). Render an absolute positioned SVG heart at `(clientX, clientY)` with a CSS fade-up animation.
    *   **Drawer**: Framer motion drag on Y axis, or a Tailwind `translate-y-full` to `translate-y-0` on a fixed bottom sheet.
