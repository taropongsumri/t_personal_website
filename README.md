## Hi this is my persomnal website

## Known problems

From the code review on 2026-10-09. Tick each one off as it gets fixed.

### Bugs and broken things

- [x] **1. Morph Slider dots only moved one step.** Clicking dot 3 from slide 1 went to slide 2. Fixed with `goTo(target)` in `src/lib/morph/morph-engine.ts`.
- [x] **2. Dead links.** "View Projects" (`Hero.svelte`) and "All projects" (`CardNav.svelte`) go to `/projects`, which doesn't exist yet. The "scroll ↓" hint in `Hero.svelte` goes to `#about`, which isn't on the home page. Fixed by removing the two `/projects` links. The scroll hint stays on purpose; point it at the section that will go below the hero.
- [x] **3. GitHub links don't match.** `Hero.svelte` uses `taropongsumri`, `CardNav.svelte` uses `ChocodevX`. Fixed: both use `taropongsumri`.
- [ ] **4. Favicon is still the default Svelte logo.** `src/lib/assets/favicon.svg` (skipped for now, on purpose; do it before sharing the site)
- [ ] **5. About page is placeholder text about someone else** ("Cleo", Bellevue College). The Education and Experience text in `src/lib/data/about.ts` is placeholder too. Replace before deploying. Partly done: About paragraphs rewritten (typo "Fist-Year", and "Running Start" is left over from the old text). Still placeholder: Education/Experience in `about.ts`, including made-up example claims.

### Performance

- [x] **6. Pages are rendered by a server function on every visit.** The site has no dynamic data. Add `export const prerender = true` in `src/routes/+layout.ts` so Vercel serves static files from its CDN. Fixed: `src/routes/+layout.ts` prerenders every page. `handleMissingId` is set to `'warn'` in `vite.config.ts` because of the scroll hint's `#about`; set it back once that section exists.
- [ ] **7. Text is invisible until JavaScript runs.** (skipped for now, on purpose) `FadeIn` starts at `opacity: 0` and `SplitText` starts `invisible`, so the hero is blank on slow phones or with JS off. Only hide content once JS is running.
- [x] **8. Fonts: 690 files (25 MB) in the build**, because `@fontsource/shippori-mincho/400.css` includes every Japanese subset. Import the Latin-only files (`latin-400.css`, `latin-500.css`, `latin-700.css`). Fixed: now 6 files (188 KB); the whole static site is 908 KB.
- [ ] **9. Portrait is 190 KB at 1045×1306** but shows at most 384px wide. Convert `static/txrokps_main.jpg` to WebP at about 800px wide (about 40 KB) and add `fetchpriority="high"`.
- [ ] **10. `static/logos/csru.png` is 36 KB at 488×409** for a 40px logo. Use a 128×128 square (about 5 KB).
- [x] **11. Morph Slider redraws 60 times a second while visible**, even when idle, just for the `drift` wobble. Draw only during transitions and drags, or set `drift` to 0. Fixed: the engine now draws on demand and `drift` defaults to 0, so an idle slider draws nothing.

### Code quality

- [x] **12. Personal info is in three places.** Name, email and socials are in `Hero.svelte`, `CardNav.svelte` and the About page separately (that's how #3 happened). Move them into one `src/lib/data/site.ts`. Fixed: `src/lib/data/site.ts` holds name, role, email, socials and stack; Hero, CardNav and page titles read from it.
- [x] **13. Outdated comments.** `CardNav.svelte` still mentions the old kraft theme. Fixed.
- [x] **14. Unused file:** `static/logos/42bkk_whitebg.jpg`. Fixed: deleted.
- [x] **15. Initials placeholder.** "42 Bangkok" shows just "B" because only capital letters are taken (`AboutEntry.svelte`). Use the first character of each word. Fixed: first character of the first two words ("42 Bangkok" → "4B").
- [x] **16. Dropdown rows don't look clickable.** No hover effect on `AboutEntry` rows, only the small chevron. Fixed: the row gets a soft background on hover and a pointer cursor.
- [x] **17. Underline colour written twice.** `#d97757` is in `--highlight` and inside the `.hand-underline` SVG in `layout.css`. Use a CSS `mask` with `background: var(--highlight)` so it lives in one place. Fixed: the SVG is now a CSS mask and the colour comes from `--highlight`.

### SEO and sharing

- [ ] **18. No `<meta name="description">` or Open Graph tags**, so shared links show no preview.

### Git

- [ ] **19. Lots of uncommitted work**: About page, Morph Slider, `ogl`, `src/lib/data/about.ts`.
- [ ] **20. Vague or duplicate commit messages** (`cdd9aef` and `de0d765` are identical, `84004c4` is vague). Nothing to change now; keep messages specific from here on.

### Suggested order

1. Commit what's there now (#19).
2. Quick wins: #2, #3 + #12, #13, #14, #15.
3. Speed: #6, #7, #8, #9, #10, #11.
4. Polish: #4, #16, #17, #18.
5. Replace the placeholder text (#5) before the next real deploy.
