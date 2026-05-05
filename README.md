# Zitro Technical Test — Game Developer
**Adrián Núñez Garrido**

Includes:
- Build for Web Desktop (Builds/Windows)
- Build for Android (Builds/Android)


## Architecture

MVC pattern with Dependency Injection via per-scene **Installers** (composition root).  
Each scene has its own `Model → Controller → View` triad. Controllers and Models are plain TypeScript — no engine dependency, fully unit-testable.

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
  
### TimeService
- Live clock fetched from `worldtimeapi.org`
- Automatic fallback to `timeapi.io` if primary fails
- Final fallback to device local time — clock always works
---

### Main Menu
- Display of cached time in Splash Screen.
- Three navigation buttons: **Quiz**, **Slot**, **Exit**
- Each button triggers a fade-out before navigating or calling `game.end()`

---

### Quiz Game
- 10 questions loaded from `resources/quizGameConfiguration.json` (pre-loaded in Splash Scene)
- Questions and answers randomised each game.
- Entrance animation: statement fades in → answers fade in with delay (`StatementFadeAnimation`)
- Answer buttons disabled during animation, enabled on fade complete
- Correct/incorrect feedback with color-coded `RichText` labels
- Wrong answer shows the correct answer text
- Final score panel with Play Again option
- All feedback and result labels serializable from the Inspector
- Segmented view with different scripts related to their responsability.

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
- Coded animations controlled by reel.
- Win detection: 3 matching centre symbols.
- All reel dimensions centralised in `SlotGameConfiguration` (single-file resizing)
- Assets read from `AppCache` — no runtime loading in game scenes
- Sounds: spin start, spin loop, stop per reel, win

---
EXTRAS:
### Animation Controller
- Animation Controller with composer pattern.
- Template for future animation implementations.
- Multi-step sequences without modifying the `IAnimation` interface — open/closed in practice.

### Game Scene
- Common MVC module for for different game scenes.
- Contains common features across scenes.
- Open for feature extension. 

---

## What problems did I found
---

## Possible Improvements
- Event bus / signal system to replace direct callback field wiring between layers
- Mobile connection to time API service
- Timer per question
- Better quiz statement generation with more statements, categories
- More winning conditions in slot with partial wins (two matching) and multipliers
- Bet system with persistent balance
- Expose reel configuration as Inspector `@property` fields
- Audio manager singleton with volume control, mute and channel categories (SFX / music)
- Localisation service for multi-language support

---

## Requirements

| Requirement | Status |
|---|---|
| Splash scene with loading bar (≥5s) | ✅ |
| Main menu with worldtimeapi.org clock | ✅ |
| Two navigation buttons | ✅ |
| Quiz scene with JSON (≥10 questions) | ✅ |
| Quiz fade animation | ✅ |
| Correct/incorrect feedback | ✅ |
| Game completed message with score | ✅ |
| Slot Machine 3×3 | ✅ |
| Left→right spin with 2s stagger | ✅ |
| Minimum 3s all reels spinning | ✅ |
| Left→right stop with 2s stagger | ✅ |
| Prize on 3 matching centre symbols | ✅ |
| Back-to-menu in Quiz and Slot | ✅ |
| Mobile (Android) support | ✅ |
| API loading/error state management | ✅ |
| Sounds in Slot | ✅ |
| Images in SpriteAtlas | ✅ |
| Code-based and editor animations | ✅ |

---

*Adrián Núñez Garrido — 2026*
