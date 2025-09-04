# MealReel (GitHub Pages)

Local-only web app to save YouTube recipe Shorts. Works offline; installable as a PWA.

## Deploy on GitHub Pages
1. Create a new public repo, e.g., `mealreel`.
2. Upload all files from this folder (`index.html`, `manifest.webmanifest`, `sw.js`, `.nojekyll`, icons).
3. Commit to `main` branch.
4. In **Settings → Pages**: set Source = `Deploy from a branch`, Branch = `main` / root.
5. Open your site: `https://YOUR_USERNAME.github.io/mealreel/`

## Notes
- Android PWAs support Web Share Target (share URLs into the app). iOS currently does not; paste links instead.
- Data is stored locally in IndexedDB.
