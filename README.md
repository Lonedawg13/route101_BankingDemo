# Route101 Banking AI demo

Upload all files in this package to the repository root.

## Pages
- `index.html`: home page. Amara is shown with living motion: breathing, gentle sway and a slight head tilt, with the portrait leaning gently towards the visitor's pointer. Blinks and gaze come from the animated file. Her greeting types out once in a speech bubble.
- `chat.html`: chat demo. Static portrait only. Cognigy Webchat is loaded as before.
- `voice.html`: voice demo. Static portrait only. Cognigy Click to Call is loaded as before.

## Cognigy setup
Endpoints are set directly in `chat.html` and `voice.html` (the Cognigy script blocks). `config.js` is not loaded by any page. If you want it to drive the endpoints, the two pages need to read `window.ROUTE101_BANKING_CONFIG` before their Cognigy scripts run.

## Avatar files
- `amara-idle-natural.webp`: animated home-page portrait (gaze, blink, head tilt and eyebrow movement are built in). Used on `index.html` only.
- `amara-speaking-loop.webp`: generic speaking-state loop. Used on `index.html` only, when `window.AmaraAvatar.speaking()` is called.
- `amara-static-fallback.webp`: reduced-motion fallback on `index.html`.
- `amara-static-hd.webp`: 800px static portrait used on `chat.html` and `voice.html`.
- `amara-avatar.png`: original static avatar for the Cognigy widget (not used by the pages).

Motion on the home page is applied in the browser (`app.js`) and stops when the hero is off-screen, the tab is hidden, or the visitor has reduced motion turned on.

## Integration hooks
`window.AmaraAvatar.idle()`, `.speaking()` and `.setState(state)` switch the home-page portrait. The same states can be triggered with the `amara:speaking` and `amara:idle` window events. These have no effect on the chat and voice pages, which stay static by design.

The speaking loop is not phoneme-level lip-sync. True lip-sync needs TTS viseme events.
