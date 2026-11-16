# Route101 Banking AI demo

Upload all files in this package to the repository root.

## Pages
- `index.html`: home page. Amara plays as a looping video, with a living motion layer on top: breathing, gentle sway and a slight head tilt, with the portrait leaning gently towards the visitor's pointer. Blinks and gaze come from the animated file. Her greeting types out once in a speech bubble.
- `chat.html`: chat demo. Static portrait only. Cognigy Webchat is loaded as before.
- `voice.html`: voice demo. Static portrait only. Cognigy Click to Call is loaded as before.

## Cognigy setup
Endpoints are set directly in `chat.html` and `voice.html` (the Cognigy script blocks). `config.js` is not loaded by any page. If you want it to drive the endpoints, the two pages need to read `window.ROUTE101_BANKING_CONFIG` before their Cognigy scripts run.

## Avatar files
- `amara-idle-loop.mp4` / `.webm`: 5.8-second looping video used on `index.html` (default state). Re-encoded from the idle animation at 25 fps with a seamless loop point.
- `amara-speaking-loop.mp4` / `.webm`: 2.8-second looping video for the speaking state on `index.html`.
- `amara-static-fallback.webp`: poster frame on `index.html`, and the image shown to visitors with reduced motion.
- `amara-static-hd.webp`: 800px static portrait used on `chat.html` and `voice.html`.
- `amara-idle-natural.webp`, `amara-speaking-loop.webp`: the animated WebP sources the videos were made from. No longer referenced by the pages.
- `amara-avatar.png`: original static avatar for the Cognigy widget (not used by the pages).

To swap in a new video, replace the MP4 and WebM pair with the same file names, or change the `data-idle-src` and `data-speaking-src` attributes on the `<video>` element in `index.html`. Export a WebM and an MP4 at the same square size, with no audio track.

Motion on the home page is applied in the browser (`app.js`) and stops when the hero is off-screen, the tab is hidden, or the visitor has reduced motion turned on. The video pauses while it is off-screen.

## Integration hooks
`window.AmaraAvatar.idle()`, `.speaking()` and `.setState(state)` switch the home-page video. The same states can be triggered with the `amara:speaking` and `amara:idle` window events. These have no effect on the chat and voice pages, which stay static by design.

The speaking loop is not phoneme-level lip-sync. True lip-sync needs TTS viseme events.
