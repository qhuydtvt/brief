# Developer & Agent Guide: Brief Web App

Welcome to the **Brief** project codebase. This documentation is designed to quickly onboard developers and agent systems, explaining the project structure, configuration constraints, design architecture, and custom interactive component logic.

---

## 🚀 1. Tech Stack Overview

The application is built on a modern frontend stack using the latest stable major versions of web frameworks:

*   **React 19.2.3**: Leverages the new React Compiler via [vite.config.ts](file:///Users/huynq/Learn/brief/vite.config.ts#L10-L13) (`babel-plugin-react-compiler`) to optimize rendering and automatically memoize component sub-trees.
*   **Vite 7.2.7**: Next-generation frontend tooling providing lightning-fast Hot Module Replacement (HMR) and optimized rollup production bundles.
*   **Tailwind CSS v4.1.18**: Powered by the brand-new rust-based engine, utilizing `@tailwindcss/vite` for build-time stylesheet compilation. Configuration resides inside [src/styles/globals.css](file:///Users/huynq/Learn/brief/src/styles/globals.css).
*   **shadcn/ui**: Component library configuration stored in [components.json](file:///Users/huynq/Learn/brief/components.json). Primitives are located inside the UI components directory ([src/components/ui/](file:///Users/huynq/Learn/brief/src/components/ui)).
*   **TypeScript ~5.9.3**: Strictly configured to enforce type-safety, module standards, and side-effect imports.
*   **@dnd-kit/core ^6.3.1**: Lightweight, performant library used for handling user pointer drag-and-drop operations without triggering rendering bottlenecks.

---

## 🛠️ 2. Common Development Commands

The workspace uses `pnpm` (configured via [package.json](file:///Users/huynq/Learn/brief/package.json#L6-L11)). Execute the following commands in the project root:

*   **Start Local Development Server**:
    ```bash
    pnpm dev
    ```
    Starts the Vite dev server. Open the local address printed (typically `http://localhost:5173`).

*   **Typecheck and Build for Production**:
    ```bash
    pnpm build
    ```
    Runs TypeScript compiler check (`tsc -b`) to verify type integrity and then runs Vite production bundling.

*   **Lint Code**:
    ```bash
    pnpm lint
    ```
    Triggers ESLint check using the flat config specified in [eslint.config.js](file:///Users/huynq/Learn/brief/eslint.config.js).

*   **Preview Production Build Locally**:
    ```bash
    pnpm preview
    ```
    Starts a local static server hosting the output of the `dist/` production folder.

---

## 📂 3. Project Structure

A layout map of the project files and directories:

```
/Users/huynq/Learn/brief/
├── components.json              # shadcn/ui framework mapping details
├── eslint.config.js             # ESLint configuration
├── package.json                 # Project dependencies, scripts, engines
├── tailwind.config.ts           # Tailwind auxiliary configuration file
├── tsconfig.json                # TypeScript project reference settings
├── tsconfig.app.json            # Main application TypeScript compiler configurations
├── tsconfig.node.json           # Vite runtime config TypeScript setup
├── vite.config.ts               # Vite server configurations & path alias setups
├── index.html                   # HTML Entry template (mounts main.tsx)
├── src/
│   ├── main.tsx                 # Core bundle mounting script (wraps App in StrictMode)
│   ├── App.tsx                  # Primary component container containing viewport & logic
│   ├── vite-env.d.ts            # Vite client type injections
│   ├── components/              # Project modular UI and features
│   │   └── ui/                  # shadcn/ui atomic components
│   │       ├── badge.tsx        # Inline chip badge indicator component
│   │       └── button.tsx       # Standard polymorph Button built on top of Radix Slot
│   ├── lib/
│   │   └── utils.ts             # Tailwind-merge utility cn() helper function
│   └── styles/
│       └── globals.css          # Tailwind imports, custom theme variables, base styles
```

---

## ⚙️ 4. Key Configuration Rules

### A. Path Aliases
The directory structure defines a custom alias `~/*` referencing the `./src/*` directory.
*   **Vite Configuration**: Defined in [vite.config.ts](file:///Users/huynq/Learn/brief/vite.config.ts#L17-L19).
*   **TS Configuration**: Defined in [tsconfig.app.json](file:///Users/huynq/Learn/brief/tsconfig.app.json#L28-L30).
*   **Usage**: Imports should always reference paths from the root using the `~` prefix (e.g., `import { cn } from "~/lib/utils"` or `import { Button } from "~/components/ui/button"`). Do not use relative directory nesting (`../../components`).

### B. Verbatim Module Syntax
In [tsconfig.app.json](file:///Users/huynq/Learn/brief/tsconfig.app.json#L14), the compiler flag `"verbatimModuleSyntax": true` is explicitly turned on.
*   **Constraint**: Under this syntax rule, type-only declarations must be explicitly marked with the `type` modifier when importing them. Non-conforming imports will trigger compiler errors during building.
*   **Incorrect**:
    ```typescript
    import { DragEndEvent } from "@dnd-kit/core";
    ```
*   **Correct**:
    ```typescript
    import { type DragEndEvent } from "@dnd-kit/core";
    // Or:
    import type { DragEndEvent } from "@dnd-kit/core";
    ```

---

## 📱 5. UI Architecture & Interactive Features

The user interface revolves around a clean header bar, a central interactive 9:16 mobile canvas simulation, and a floating toolbar widget.

### A. Header Bar
Defined in [App.tsx:L218-244](file:///Users/huynq/Learn/brief/src/App.tsx#L218-L244), the application header is pinned using `sticky top-0 z-40`. It provides a glassmorphic background layer (`bg-background/80 backdrop-blur-md`), branding decorations, and a light/dark mode switch button.

### B. Interactive 9:16 Mobile Viewport Canvas
The centerpiece of the application is a mobile screen simulator defined in [App.tsx:L249-357](file:///Users/huynq/Learn/brief/src/App.tsx#L249-L357).
*   **Aspect Ratio**: Styled using Tailwind's `aspect-[9/16]` with strict boundary rules (`h-[85vh] max-h-[880px] max-w-[95vw]`).
*   **Physics Scrolling/Swiping**: Implemented utilizing standard browser CSS scroll-snapping logic.
    *   The viewport container applies `overflow-y-scroll snap-y snap-mandatory` along with custom scrollbar hidden properties (`no-scrollbar`).
    *   Each child slide applies `h-full w-full shrink-0 snap-start` to ensure seamless vertical alignment behavior.
*   **Feed Content**: Toggles between "Static Feed" (hardcoded array of slides describing features) and "Dynamic Feed" (loaded dynamically from `localStorage` state) based on the current selection in the Modes widget.

### C. Draggable Modes Widget (dnd-kit Integration)
A floating container ([App.tsx:L37-82](file:///Users/huynq/Learn/brief/src/App.tsx#L37-L82)) allows changing the application feed mode between "Static" and "Dynamic".
*   **Positioning State**: Managed in [App.tsx](file:///Users/huynq/Learn/brief/src/App.tsx#L97) using the `coordinates` state: `{ x: number, y: number }`.
*   **Drag Logic**: Wrapped within `<DndContext onDragEnd={handleDragEnd}>`. The `handleDragEnd` function calculates the coordinate offset relative to the drop point:
    ```typescript
    const handleDragEnd = (event: DragEndEvent) => {
      const { delta } = event;
      setCoordinates((prev) => ({
        x: prev.x + delta.x,
        y: prev.y + delta.y,
      }));
    };
    ```
*   **Drag Handle Constraints**: To prevent interaction conflicts between dragging actions and click events on buttons inside the widget, the hook variables `{...listeners}` and `{...attributes}` are **only** bound to the small title handle bar at the top containing the `GripHorizontal` icon ([App.tsx:L52-59](file:///Users/huynq/Learn/brief/src/App.tsx#L52-L59)). Clicking/interacting with the `Static` and `Dynamic` buttons will not trigger drag overrides.
*   **Transform Rendering**: Inline styles compute the combined location dynamically:
    ```typescript
    const style = {
      transform: `translate3d(${coordinates.x + (transform?.x || 0)}px, ${coordinates.y + (transform?.y || 0)}px, 0)`,
    };
    ```

---

## 🤖 6. Guidelines for Developers and Agents

When editing or extending this codebase, adhere to the following principles:

1.  **Strict Type Imports**: Maintain verbatim module syntax. Avoid importing types without the explicit `type` keyword.
2.  **Path Alias**: Always use the standard alias symbol `~` to resolve paths mapping from `/src` (e.g., `~/components/ui/button`).
3.  **Tailwind CSS Utility First**: Do not add custom arbitrary style rules outside Tailwind CSS directives. If configuring new theme variables or custom classes, specify them within [src/styles/globals.css](file:///Users/huynq/Learn/brief/src/styles/globals.css).
4.  **Theme-Safety**: Ensure all text, backgrounds, and icons adapt gracefully to theme variations (check contrast ratios in both light and dark mode classes).
5.  **Interactive Elements**: When adding clickable items inside the draggable widget, ensure they do not capture the drag handle listeners, which must remain restricted to the header handler.
6.  **Code verification**: Prior to completing modifications, verify that the application compiles correctly using `pnpm build`.
