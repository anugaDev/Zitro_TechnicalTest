# Zitro Technical Test — Game Developer
**Adrián Núñez Garrido**

Includes:
- Build for Web Desktop (Builds/Windows)
- Build for Android (Builds/Android)

---

## Code Structure

- MVC pattern architecture.
- Dependency Injection via per-scene **Installers** (composition root).
- Scenes treated as their own MVC module for better scalability and readability.
- Controllers and Models are plain TypeScript — no engine dependency, fully unit-testable.
- Views and Models communicate through typed callbacks wired by the Controller, enforcing clear
  and explicit inter-layer boundaries.
- Application cache singleton with resource load for memory optimization.
- Shared systems — animations, navigation, asset cache and error handling — isolated in a Core layer
  consumed by all modules, with no cross-feature dependencies.

```
SplashScreen → MainMenu → QuizGame | SlotMachine
```

**Shared systems:** `Core/Animations`, `SceneNavigator`, `AppCache`, `ApiResult<T>`, `GameScene MVC`

---

## Scenes

### Splash Screen
- Minimum 5-second loading screen with animated progress bar.
- Sequential async loading: Sprite Atlas → Audio Clips → Quiz JSON → Server Time.
- 100 ms visual delay between each asset step for feedback clarity.
- All results typed with `ApiResult<T>` — no exceptions as control flow.
- Status label updates per step: `Loading…` / `✓ Asset Name` / `✗ Error`.
- All UI texts serializable from the Inspector (`loadingText`, `standByText`, etc.).
- Progress split: 75% timer weight + 25% asset load weight.

---

### Main Menu
- Live clock fetched from `worldtimeapi.org`, cached during Splash and displayed on entry.
- Automatic fallback to `timeapi.io` if primary fails.
- Final fallback to device local time — clock always works.
- Three navigation buttons: **Quiz**, **Slot**, **Exit**.
- Each button triggers a fade-out before navigating or calling `game.end()`.
- Platform-aware **Exit** button display depending on the current system.

---

### Quiz Game
- Statements loaded from `resources/quizGameConfiguration.json` (pre-loaded in Splash Scene).
- Both question order and answer order shuffled each game.
- Entrance animation: statement fades in → answers fade in with delay (`StatementFadeAnimation`).
- Answer buttons disabled during animation, enabled on fade complete.
- Correct/incorrect feedback with color-coded `RichText` labels.
- Wrong answer shows the correct answer text. On all questions answered, final panel shows score with Play Again option.
- All feedback and result labels serializable from the Inspector.
- Segmented view with different scripts each related to their own responsibility.

**View architecture:**

| Component | Responsibility |
|---|---|
| `QuizGameView` | Panel orchestrator |
| `QuestionPanelView` | Statement + answer buttons |
| `FeedbackPanelView` | Feedback text + Next button |
| `ResultsPanelView` | Score + Play Again button |
| `StatementAnimationHandler` | Encapsulates the 4 quiz animations |

---

### Slot Machine
- 3×3 grid with dynamically built reel strips from a `SpriteAtlas`.
- Reel flow and order implemented in the controller for clear responsibility isolation in each layer.
- Frame-by-frame tween animation driven by the reel's update loop.
- All reel dimensions centralised in `SlotGameConfiguration`.
- Sounds: spin start, spin loop, stop per reel, win.
- Segmented view following the same principle as the Quiz — each component is named and scoped to a single responsibility.

**View architecture:**

| Component | Responsibility |
|---|---|
| `SlotGameView` | Scene orchestrator — spin button, audio, win panel |
| `ReelView` | Per-reel motion, update loop, stop tween |
| `ReelStripBuilder` | Builds the symbol strip node hierarchy at runtime |
| `SlotSymbolRepository` | Resolves `SpriteFrame`s from the atlas by `SlotSymbolEnum` |
---

## Optionals Summary

All 5 optional requirements from the test specification have been implemented.

### 1. Mobile Device Support

The project builds and runs on Android via Cocos Creator's native Android pipeline. Key adaptations:

- **Resolution policy**: design resolution 1920×1080 with `SHOW_ALL` fit mode — the aspect ratio is preserved on any screen size without clipping content.
- **Touch input**: all interactive elements (`Button` components) respond to both mouse clicks and touch events natively in Cocos Creator without extra code.
- **Exit button behaviour**: `game.end()` is guarded by `sys.isNative` — on web the exit button is hidden automatically since `window.close()` is blocked by browsers; on Android it terminates the application as expected.

### 2. API Loading and Error State Management

Every external request uses `ApiResult<T>`, a typed discriminated union (`'loading' | 'success' | 'error'`), so UI and business logic never deal with raw exceptions.

**Server time fetch** (`TimeService`):
- Primary: `worldtimeapi.org` with 8s `Promise.race` timeout.
- Fallback: `timeapi.io` on any failure.
- Final fallback: `new Date()` — the clock is always displayed regardless of network state.

**Splash asset loading** (`SplashAssetLoader`):
- Each step (`SpriteAtlas`, `AudioClip[]`, `QuizJSON`, `ServerTime`) emits `ApiResult<string>` with distinct states.
- The view displays a per-step status label: `Loading…` → `✓ Slot Atlas` or `✗ Server Time — Timeout`.

### 3. Audio in the Slot Scene

Four audio events are implemented in the Slot scene:

| Event | Clip | Behaviour |
|---|---|---|
| Spin start | `SpinStartClip` | One-shot on the first reel kick-off |
| Spin loop | `SpinLoopClip` | Loops continuously while reels are spinning |
| Spin stop | `StopClip` | One-shot every time a reel stops |
| Win fanfare | `WinClip` | Plays on a dedicated `WinAudio` source when 3 matching symbols land |

Audio stops automatically when the spin button is re-enabled and when the scene exits. All clips are assigned via `@property` fields in the Inspector, pre-loaded during Splash and cached in `AppCache` with `addRef()`.

### 4. Sprite Atlas

Slot machine symbols are packed into a single `SpriteAtlas` (`.plist` + `.png`) generated with **TexturePacker**:

- 6 symbols: `Cherry`, `Lemon`, `Grape`, `Star`, `Bell`, `Diamond`.
- The atlas is loaded once during Splash (`SplashAssetLoader`) and cached in `AppCache.instance.SlotAtlas`.
- `SlotSymbolRepository` pulls individual `SpriteFrame`s from the atlas by name at runtime, keyed by `SlotSymbolEnum` (e.g. `SlotSymbolEnum[0]` → `"Cherry"`).
- Using an atlas eliminates individual texture draw calls — all 6 symbols render in a single batch.

### 5. Animations: Native and Code-Based

Three animation approaches are used across the project:

**By code — `AnimationController` + `IAnimation`:**

A custom animation system built on `cc.tween` and `UIOpacity`. Each effect implements `IAnimation { play(), cancel(), onFinished }` and is registered in an `AnimationController` by string ID:

- `FadeInAnimation` — tweens `UIOpacity` 0 → 255
- `FadeOutAnimation` — tweens `UIOpacity` 255 → 0
- `StatementFadeAnimation` — composed sequence: statement fade-in → configurable delay → answers fade-in

Used in: scene transitions (Splash, Main Menu, Game Scene), quiz statement entrance, and results panels.

**Native tween — reel scrolling:**

The reel spinning uses `cc.tween` directly on the strip node transform, driven by `ReelView.update()` each frame. The landing tween (`stopSpin`) applies a `cubicOut` ease-out to smoothly decelerate the strip to the target symbol position.

**Editor animation clip — win celebration:**

A looped `AnimationClip` created in the Cocos Creator timeline animates the Win text in the Slot Scene, played only when the player wins.

---

## Extras

### Animation Controller
- Strategy + Registry pattern — animations registered by ID and triggered by name.
- `IAnimation` interface as template for future animation implementations — open/closed in practice.
- Allows single or multi-step sequences without modifying the core `AnimationController`.

### Game Scene
- Common MVC module for different game scenes.
- Contains common features across scenes.
- Small module open for future extension.

---

## Reflections

- The main challenge was adapting the MVC pattern to a Cocos Creator environment. While the principle is familiar, applying it without any framework support — no dependency injection container, no reactive bindings — meant that every wiring decision between Controllers, Models and Views had to be designed from scratch. The Installer pattern served as a composition root and kept that complexity contained, but reaching a structure that felt both clean and scalable required several passes of refactoring across nearly every module.

- Segmenting the Quiz view into focused sub-components (`QuestionPanelView`, `FeedbackPanelView`, `ResultsPanelView`, `StatementAnimationHandler`) was a deliberate quality decision that had a real cost under time pressure. Keeping each piece within its own responsibility while still coordinating them through a single `QuizGameView` orchestrator, without leaking state or creating hidden coupling, demanded constant discipline. 

- The Slot machine reels were the most technically demanding part. Building reel strips dynamically at runtime from a `SpriteAtlas`, driving the scroll frame-by-frame through the `update` loop, and then easing into a precise landing position required reconciling the rendering pipeline of Cocos Creator with the game logic layer. Isolating the construction into a `ReelStripBuilder`, the symbol resolution into a `SlotSymbolRepository`, and the motion into `ReelView` itself meant that each concern remained testable and replaceable — but arriving at those boundaries was not obvious from the start and involved a fair amount of iteration.

- The Android build was an unexpected source of friction. Cocos Creator's generated Gradle project assumed a specific NDK version that did not match the one installed locally, and the JVM arguments required for JDK 11 were not written into `gradle.properties` by default, causing the build to fail silently. Rather than fixing these by hand every time — since Cocos overwrites those files on each build — the solution was a PowerShell script that patches `gradle.properties` and `local.properties` automatically after the Cocos export step, then drives the full Gradle compilation and ADB install in a single command. The script is not an ideal long-term solution, but it made the build reproducible for the duration of the test.

---

## Possible Improvements

- Event bus / signal system to replace direct callback field wiring between layers — the first priority if the project were to grow in complexity,
  as it would decouple communicating systems and make the architecture scale without modifying existing controllers.

- Better quiz statement generation with more statements and categories. This could be smoothly implemented by expanding the logic in the model,
  as the view and controller layers do not depend on how the statements are generated — they only receive the ones in use during gameplay.

- Currently, the win condition in the slot is too rare. I would add more winning conditions with different combinations, partial wins (two matching)
  and new symbols like multipliers. The clear separation between the game logic in the model and the reel strip built dynamically via configuration script
  would allow me to implement it quickly.
  
- For a more designer-friendly approach, I would also expose reel configuration as Inspector `@property` fields to allow quick iteration during gameplay testing.
---

*Adrián Núñez Garrido — 2026*
