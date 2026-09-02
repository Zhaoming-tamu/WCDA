# DA-W Project Page

Static project page for **Weather-Conditioned Depth Anything (DA-W)**. It uses only HTML,
CSS, and JavaScript, so it can be served directly by GitHub Pages without a build step.

The page intentionally shows clear placeholders for assets and public links that are not ready.
Do not replace those placeholders with guessed URLs or preliminary anonymous-paper links.

## Visual reference

The visual system follows the [SeeClear project page](https://heyumeng.com/SeeClear-web/):
Noto Sans typography, compact 40 px desktop section spacing, 32 px section titles, white sections
with one light-gray preview band, and SeeClear's purple-gray comparison controls. The compact
top navigation, four fixed weather-comparison rows, and baseline tabs are intentional exceptions
retained from the selected 4KLSDB and DepthAnything-AC interaction references. Do not introduce a
new card, color, shadow, radius, or typography treatment without checking it against those
references.

## Preview locally

From this directory, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Do not open `index.html` directly with a `file://` URL;
using a local server matches GitHub Pages behavior and avoids browser media restrictions.

## Expected asset layout

All paths are relative, which allows the site to work at either a GitHub user domain or a
repository subpath.

```text
assets/
├── teaser/
│   ├── panels/              # 16 native Camera-ready teaser panels
│   └── teaser-four-weather.webp  # retained legacy composite
├── comparisons/
│   ├── snow/
│   │   ├── input.webp
│   │   ├── dav1.webp
│   │   ├── dav2.webp
│   │   ├── daac.webp
│   │   └── daw.webp
│   ├── fog/                 # same five filenames
│   ├── night/               # displayed as “Low-light”
│   └── rain/                # same five filenames
├── framework/
│   ├── pipeline.svg
│   └── pipeline.webp
├── results/
│   └── real-adverse-weather-clean.webp
└── video/
    ├── daw-showcase.mp4
    └── video-poster.webp
```

For every slider, export the aligned images at exactly the same pixel dimensions and with a
shared depth-color scale. WebP is used for photographs and depth maps. Retain a high-resolution
source outside this deployment directory.

The intended video is a 16:9 H.264 MP4 with the fixed three-column layout
`Input | DA V2 | DA-W`, ordered Snow → Fog → Low-light → Rain. The markup already uses
`autoplay`, `muted`, `loop`, `controls`, and `playsinline`. Until the final MP4 is added and
configured, the page displays the generated poster as a graceful placeholder.

After adding `assets/video/daw-showcase.mp4`, set `VIDEO_SOURCE` near the top of `script.js`:

```js
const VIDEO_SOURCE = "assets/video/daw-showcase.mp4";
```

The live page shows one result table: the real adverse-weather benchmark. It was rebuilt from a
temporary copy of the Camera-ready LaTeX after removing only bibliography markers from method
names; all reported values and highlighting remain unchanged. The original three paper exports
remain in `assets/results/` as local archives but are not loaded by the page.

## Add the public resource links

Edit `RESOURCE_LINKS` at the top of `script.js`:

```js
const RESOURCE_LINKS = {
  paper: "https://…",
  code: "https://github.com/…",
  model: "https://huggingface.co/…",
  data: "https://…",
};
```

Leave a value as `null` until that resource is public. Its button remains disabled and exposes
“Coming soon” as tooltip and accessibility text. The Data link should normally point to
license-compliant preparation/download instructions; it should not imply that third-party
benchmark data are redistributed by DA-W.

## Deploy with GitHub Pages

The publication repository is [Zhaoming-tamu/WCDA](https://github.com/Zhaoming-tamu/WCDA).

1. Commit the page and deployable assets, then push this directory to the repository's `main`
   branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and
   `/ (root)`.
4. Wait for the Pages workflow to finish. The default project URL will be
   `https://zhaoming-tamu.github.io/WCDA/`.

GitHub Free supports Pages from a public repository. A repository named
`YOUR-ACCOUNT.github.io` publishes at the account root, while an ordinary project
repository publishes below `/<repository-name>/`; this site uses relative paths and works in
either form.

GitHub rejects individual files larger than 100 MB. Keep the MP4 comfortably below that limit
(ideally tens of megabytes) or host it on a suitable video/CDN service and update the `<source>`
in `index.html`. A Git LFS pointer is not a drop-in video asset for a Pages site.

## Safe GitHub handoff

Do **not** share a GitHub password, browser cookie, 2FA code, SSH private key, or Personal Access
Token in chat. To publish this repository safely, use one of these approaches:

1. Create an empty public repository in your account and provide only its clone URL. If this
   machine already has an authorized SSH key, the site can then be pushed with Git.
2. Use GitHub CLI browser/device authorization on this machine. You approve the login in your
   own browser; no password or token needs to be pasted into the project or chat.

The remaining account details needed for publication are the GitHub username, repository name,
Git commit display name/email, and optionally a custom domain.

Official references: [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages),
[publishing from a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site),
[GitHub authentication](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github), and
[custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Before public launch

- Replace the provisional BibTeX when official proceedings metadata becomes available.
- Confirm the final Paper, Code, Model, and Data destinations.
- Verify redistribution terms and add any required attribution for all dataset-derived images.
- Check every slider for pixel alignment and a shared color scale.
- Test mouse, touch, keyboard arrows, reduced-motion behavior, and narrow mobile layouts.
- Add an absolute Open Graph image URL after the final Pages/custom domain is known.
- Run a broken-link check and a Lighthouse accessibility/performance pass.
