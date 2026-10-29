# Structure Lab — SMC Chart Trainer

An interactive market-structure trainer built with HTML, CSS and JavaScript. It opens in **Gauntlet**, the hardest tier, and runs without external packages, API keys or a build step.

## Features

- **35 synthetic scenarios** across Foundations, Application, Challenge, Expert and Gauntlet.
- BOS, CHoCH/MSS, liquidity sweeps, order blocks, displacement, fair value gaps and conditional entries.
- Clickable candlestick charts, FVG bands, OHLC inspection and keyboard interactions.
- **14 blind assessments with 72 independently graded checks** across 54–68 candle charts.
- Independent chart marks, exact price boundaries, displacement calculations, invalidation and reward-to-risk arithmetic.
- No hints or reference guides in the hard tiers. Every required check must pass for full credit.
- Immediate explanations and annotated charts after submitting a complete answer.
- Responsive layout and browser-local progress, retries and concept scores.

## Run locally

Clone the repository:

```bash
git clone https://github.com/AzmatAli-web/smctrainer.git
cd smctrainer
```

Serve the `dist` folder with Python:

```bash
python -m http.server 8080 --directory dist
```

On systems where Python is named `python3`, use `python3` instead. Open [http://localhost:8080](http://localhost:8080). VS Code Live Server or any static web server also works; use `dist/index.html` as the entry point.

## Verify

With Node.js 18 or newer:

```bash
npm test
npm run check
```

No `npm install` is required. The tests can also run directly:

```bash
node verify.cjs
node verify-expert.cjs
```

The checks validate synthetic OHLC data, first qualifying structure breaks, sweep rejection, order-block origin and invalidation, displacement criteria, FVG boundaries and mitigation, entry arithmetic, and strict assessment grading.

The app was also browser-tested across all 14 hard assessments, including incorrect-answer feedback, retries, saved grades, scenario navigation and mobile chart marking.

## Files

```text
dist/
  index.html             App shell
  styles.css             Responsive styles
  app.js                 Charts, interaction, scoring and progress
  scenarios.js           Original 21 scenarios and concept definitions
  expert-scenarios.js    14 hard assessments and shared grading
verify.cjs               Foundation and challenge data checks
verify-expert.cjs        Hard-assessment rules and grading checks
```

## Hosting and progress

Publish `dist/` as a static site with no build command. This repository contains the standalone app; access control for a private deployment is handled by the hosting platform. The frontend does not implement account sign-in.

Progress is stored in the current browser's `localStorage`. It is not synced across devices. Existing saved answers are preserved when upgrading; first-time visitors start in Gauntlet, and later visits resume their selected exercise.

## Training conventions

Prices are author-written synthetic examples, not historical or live quotes. Field notes explain the lab's explicit SMC rules, including close confirmation and invalidation. The exercises teach pattern recognition and conditional planning; they do not place orders or claim profitability.
