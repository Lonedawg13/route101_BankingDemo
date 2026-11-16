# Route101 Banking AI demo

A responsive website for Amara, the Route101 AI Banking Specialist.

## Files
- `index.html`: combined landing page with links to both assistants
- `chat.html`: standalone Cognigy Webchat experience
- `voice.html`: standalone Cognigy Click to Call experience
- `config.js`: the only file requiring endpoint changes
- `styles.css`, `app.js`: shared presentation and navigation
- `amara-avatar.png`: static Cognigy-safe avatar
- `amara-animated.gif`: animated website avatar

## Setup
1. Upload every file to the repository root.
2. Open `config.js`.
3. Replace `REPLACE_WITH_BANKING_WEBCHAT_ENDPOINT` with the Banking Webchat endpoint URL.
4. Replace `REPLACE_WITH_BANKING_CLICK_TO_CALL_ENDPOINT` with the Banking Click to Call endpoint URL.
5. Keep both avatar files in the same directory as the HTML files.

The previous Insurance endpoints are deliberately not reused because they point to the Henry-James Insurance configuration.
