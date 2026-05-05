# Zitro Technical Test — Game Developer
**Adrián Núñez Garrido**

Includes:
- Build for Web Desktop (Builds/Windows)
- Build for Android (Builds/Android)

---

## Code Structure

- MVC pattern architecture.
- Injection via per-scene **Installers** (composition root).
- Scenes treated as their own MVC module for better scalability and readability.
- Controllers and Models are plain TypeScript — no engine dependency, fully unit-testable.
- Views and Models communicate through typed callbacks wired by the Controller, enforcing clear and explicit inter-layer boundaries.
- Application cache singleton with resource load for memory optimization.
- Shared systems — animations, navigation, asset cache and error handling — isolated in a Core layer consumed by all modules, with no cross-feature dependencies.

```
SplashScreen → MainMenu → QuizGame | SlotMachine
```

**Shared systems:** `Core/Animations`, `SceneNavigator`, `AppCache`, `ApiResult<T>`, `GameScene MVC`

---

## Scenes

### Splash Screen
- Minimum 5-second loading screen with animated progress bar
- Sequential async loading: Sprite Atlas → Audio Clips → Quiz JSON → Server Time
- 100 ms visual delay between each asset step for feedback clarity
- All results typed with `ApiResult<T>` — no exceptions as control flow
- Status label updates per step: `Loading…` / `✓ Asset Name` / `✗ Error`
- All UI texts serializable from the Inspector (`loadingText`, `standByText`, etc.)
- Progress split: 75% timer weight + 25% asset load weight

---

### Main Menu
- Live clock fetched from `worldtimeapi.org`, cached during Splash and displayed on entry
- Automatic fallback to `timeapi.io` if primary fails
- Final fallback to device local time — clock always works
- Three navigation buttons: **Quiz**, **Slot**, **Exit**
- Each button triggers a fade-out before navigating or calling `game.end()`
- Platform-aware **Exit** button display depending on the current system

---

### Quiz Game
- Statements loaded from `resources/quizGameConfiguration.json` (pre-loaded in Splash Scene)
- Both question order and answer order shuffled each game
- Entrance animation: statement fades in → answers fade in with delay (`StatementFadeAnimation`)
- Answer buttons disabled during animation, enabled on fade complete
- Correct/incorrect feedback with color-coded `RichText` labels
- Wrong answer shows the correct answer text
- Final score panel with Play Again option
- All feedback and result labels serializable from the Inspector
- Segmented view with different scripts each related to their own responsibility

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
- 3×3 grid with dynamically built reel strips from a `SpriteAtlas`
- Reels start left → right with 2-second stagger
- Minimum 3 seconds all reels spinning simultaneously
- Reels stop left → right with 2-second stagger
- Frame-by-frame tween animation driven by the reel's update loop
- Win detection: 3 matching centre symbols
- All reel dimensions centralised in `SlotGameConfiguration` (single-file resizing)
- Assets read from `AppCache` — no runtime loading in game scenes
- Sounds: spin start, spin loop, stop per reel, win

---

## Optionals Summary

All 5 optional requirements from the test specification have been implemented.

### 1. Mobile Device Support

The project builds and runs on Android via Cocos Creator's native Android pipeline. Key adaptations:

- **Resolution policy**: design resolution 1920×1080 with `SHOW_ALL` fit mode — the aspect ratio is preserved on any screen size without clipping content
- **Android build pipeline**: a PowerShell script (`build-android.ps1`) automates the full compilation and ADB install flow, including NDK/JDK version fixes and `gradle.properties` patching for the local toolchain
- **Touch input**: all interactive elements (`Button` components) respond to both mouse clicks and touch events natively in Cocos Creator without extra code
- **Exit button behaviour**: `game.end()` is guarded by `sys.isNative` — on web the exit button is hidden automatically since `window.close()` is blocked by browsers; on Android it terminates the application as expected

### 2. API Loading and Error State Management

Every external request uses `ApiResult<T>`, a typed discriminated union (`'loading' | 'success' | 'error'`), so UI and business logic never deal with raw exceptions.

**Server time fetch** (`TimeService`):
- Primary: `worldtimeapi.org` with 8s `Promise.race` timeout
- Fallback: `timeapi.io` on any failure
- Final fallback: `new Date()` — the clock is always displayed regardless of network state

**Splash asset loading** (`SplashAssetLoader`):
- Each step (`SpriteAtlas`, `AudioClip[]`, `QuizJSON`, `ServerTime`) emits `ApiResult<string>` with distinct states
- The view displays a per-step status label: `Loading…` → `✓ Slot Atlas` or `✗ Server Time — Timeout`

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

- 6 symbols: `Cherry`, `Lemon`, `Grape`, `Star`, `Bell`, `Diamond`
- The atlas is loaded once during Splash (`SplashAssetLoader`) and cached in `AppCache.instance.SlotAtlas`
- `SlotSymbolRepository` pulls individual `SpriteFrame`s from the atlas by name at runtime, keyed by `SlotSymbolEnum` (e.g. `SlotSymbolEnum[0]` → `"Cherry"`)
- Using an atlas eliminates individual texture draw calls — all 6 symbols render in a single batch

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
- Strategy + Registry pattern — animations registered by ID and triggered by name
- Template for future animation implementations
- Multi-step sequences without modifying the `IAnimation` interface — open/closed in practice

### Game Scene
- Common MVC module for different game scenes
- Contains common features across scenes
- Small module open for future extension

---

## Possible Improvements
- Event bus / signal system to replace direct callback field wiring between layers
- Better quiz statement generation with more statements and categories
- More winning conditions in slot with partial wins (two matching) and multipliers
- Bet system with persistent balance
- Expose reel configuration as Inspector `@property` fields
- Audio manager singleton with volume control, mute and channel categories (SFX / music)
- Localisation service for multi-language support

---

*Adrián Núñez Garrido — 2026*
