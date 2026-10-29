# Structure Lab — SMC Chart Trainer

One website link, with two complete versions to choose from. The entry page always offers **Easy** (the original website) and **Hard** (the newer difficult website).

## Choose your website

| Version | What opens | Exercises |
| --- | --- | --- |
| Easy · original | The original guided trainer, starting in Foundations | 21 scenarios with hints, clear reference levels and instant explanations |
| Hard · newer | The difficult trainer, starting in Gauntlet | A 35-scenario bank including 14 blind assessments, 72 separately graded checks and dense 54–68 candle charts |

Both cover BOS, CHoCH/MSS, liquidity sweeps, order blocks, displacement, FVGs and conditional entries. The original content remains available in its own website. Each trainer has a **Choose version** link back to the shared entry page.

## Run locally

```bash
git clone https://github.com/AzmatAli-web/smctrainer.git
cd smctrainer
python -m http.server 8080 --directory dist
```

Use `python3` if that is your Python command. Open [http://localhost:8080](http://localhost:8080) to choose a version. The separate websites are available at `/easy/` and `/hard/`. VS Code Live Server or any static web server also works.

No packages, API keys, build command or `npm install` are required.

## Verify

With Node.js 18 or newer:

```bash
npm test
npm run check
```

The tests validate the 21 original scenarios, hard-assessment rules and grading, chooser links, required assets, progress migration and reset isolation. Browser QA also verifies both website links, easy and hard answer submissions, back navigation, persistence and independent resets. Both choices and return navigation also pass at a 390px mobile width.

## Files

```text
dist/
  index.html          Shared Easy / Hard chooser
  hub.css             Chooser styles
  version-state.js    One-time progress migration
  easy/               Original guided website
  hard/               Newer difficult website
verify.cjs            Original scenario checks
verify-expert.cjs     Hard assessment checks
verify-versions.cjs   Both websites, migration and reset checks
```

## Hosting and progress

Publish the entire `dist/` directory as a static site with no build command. Keep the `easy/` and `hard/` directories and their index files together. Private-deployment access control is provided by the hosting platform; the frontend does not implement sign-in.

The two websites store progress separately in browser `localStorage`, without syncing across devices. Existing answers from the previous single trainer are migrated once. Resetting one version leaves the other version’s answers intact. Visiting the root page always shows both choices.

## Training conventions

All chart prices are synthetic. Field notes inside each website explain the lab’s SMC conventions, including structural closes and invalidation. The trainers teach recognition and conditional planning; they do not place orders or claim profitability.
