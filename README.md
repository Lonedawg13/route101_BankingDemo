# Route101 Banking AI demo

Upload all files in this package to the repository root.

## Cognigy setup
Open `config.js` and replace both placeholder endpoint values with the Route101 Banking Webchat and Click to Call endpoints.

## Avatar files
- `amara-idle-natural.webp`: default gaze, blink, head tilt and eyebrow animation
- `amara-speaking-loop.webp`: generic speaking-state mouth animation
- `amara-static-fallback.webp`: reduced-motion fallback
- `amara-avatar.png`: static Cognigy widget avatar

The website uses the idle asset by default. Integrations can switch state with `window.AmaraAvatar.speaking()` and return with `window.AmaraAvatar.idle()`. The speaking loop is not phoneme-level lip-sync; true lip-sync requires TTS viseme events.
