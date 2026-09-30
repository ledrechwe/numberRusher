# Number Rush — Submission Build

Number Rush is an HTML5 thinking game focused on fast mental arithmetic, pattern recognition, and problem solving.

## Requirement checklist

- **HTML5:** Yes. The game uses standard HTML, CSS, and JavaScript only.
- **Thinking / problem-solving gameplay:** Yes. Players solve increasingly difficult arithmetic problems under different game rules.
- **No violence:** Yes.
- **No foul language:** Yes.
- **No advertising:** Yes. There are no ads, promotional banners, affiliate elements, or promotions for another site/company.
- **No external links:** Yes. The game contains no clickable external links and loads no external web resources.
- **No stats reporting / analytics:** Yes. There is no analytics, telemetry, tracking pixel, server request, or remote stats counter.
- **No name entry:** Yes. The game contains no username, player-name, initials, or leaderboard name-entry field.
- **Local save only:** High scores and progress are stored only in the player's browser using `localStorage`.
- **No plugins:** Yes. No Flash or other browser plugin is required.

## Extra privacy protection

The HTML includes a Content Security Policy that blocks external network connections from the game.

## Game modes

- **Classic:** Solve as many problems as possible in 60 seconds.
- **Endless:** Continue until all 3 lives are lost.
- **Zen:** Play without a timer or lives.

## Files

- `index.html`
- `style.css`
- `game.js`
- `README.md`

## Suggested repository name

`number-rush`

## Suggested commit message

`Prepare Number Rush for HTML5 game submission`


## Color Pop visual update

This version uses a more energetic arcade-inspired visual style:
- dark navy background
- cyan, pink, orange, green, blue, and purple accents
- four differently colored answer buttons
- multicolor Fever Meter
- more colorful score cards, modes, stats, and help panels

The submission/privacy requirements remain unchanged: no advertising, external links, analytics, name entry, or outside network connections.

## V2 tweak

- Achievement titles and descriptions are slightly smaller.
- Every correct answer in Classic mode adds exactly **1 second** to the timer.


## V3 fake leaderboard

- Added a **Leaderboard** tab with lots of **fake usernames** and scores.
- It is only for presentation/style, with no name entry and no outside connections.
