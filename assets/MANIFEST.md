# DA-W project-page asset manifest

The static figures were prepared from the local Camera-ready source and the
verified `recoverable_20` inference run. The video directory additionally holds
four reviewed inference clips selected for the public project page. Original
source videos, raw prediction caches, and review-only candidates are not copied
into this deployment directory.

## Directory map

```text
assets/
├── teaser/
│   ├── panels/
│   │   ├── {snow,fog,lowlight,rain}-input.png
│   │   ├── {snow,fog,lowlight,rain}-dav2.png
│   │   ├── {snow,fog,lowlight,rain}-daac.png
│   │   └── {snow,fog,lowlight,rain}-daw.png
│   ├── teaser-four-weather.png
│   └── teaser-four-weather.webp
├── comparisons/{snow,fog,night,rain}/
│   ├── input.{png,webp}
│   ├── dav1.{png,webp}
│   ├── dav2.{png,webp}
│   ├── daac.{png,webp}
│   └── daw.{png,webp}
├── framework/
│   ├── pipeline.svg
│   ├── pipeline.png
│   └── pipeline.webp
├── results/
│   ├── real-adverse-weather-clean.{png,webp}
│   ├── real-adverse-weather.{png,webp}
│   ├── kitti-c.{png,webp}
│   └── clean-benchmarks.{png,webp}
└── video/
    ├── snow.mp4 / snow-poster.jpg
    ├── fog.mp4 / fog-poster.jpg
    ├── low-light.mp4 / low-light-poster.jpg
    ├── rain.mp4 / rain-poster.jpg
    └── video-poster.{png,webp}  # retained legacy placeholder
```

The sliders and tables use WebP for normal delivery. The live teaser intentionally
uses its native PNG panels so no scientific panel is re-encoded; the SVG pipeline
is preferred when browser performance is acceptable.

## Four-weather Camera-ready teaser

The live page now lays out the 16 native **576 × 386 px** PNG panels from
`teaser/panels/` with HTML and CSS. Column and row labels are real text rendered
with the Comic Sans-compatible teaser font stack, so labels remain responsive
and cannot overwrite the scientific panels. No panel is resized or edited in
the stored asset.

The older baked composite is retained for provenance but is no longer loaded by
the page. Its `DA-W (Ours)` label extended into the first panel because the
182 px label was centered in a 166 px gutter.

- Output: `teaser/teaser-four-weather.png` and `.webp`
- Output dimensions: **2400 × 1602 px**
- Layout and labels: the Camera-ready 4-column × 4-row layout, in this exact
  order:
  - columns: `Snow`, `Fog`, `Low-light`, `Rain`
  - rows: `Input`, `DA v2`, `DA-AC`, `DA-W (Ours)`
- Source root:
  `../../verification/paper_visual_reconstruction/reference_camera_ready/images/teaser/`
- Source panels:
  - Snow: `snow/snow_2_{img,baseline,pred}.png` and
    `snow/ac_teasor_snow.png`
  - Fog: `fog/203_{img,baseline,pred}.png` and `fog/ac_teasor_fog.png`
  - Low-light: `night/4_{img,baseline,pred}.png` and
    `night/ac_teasor_night.png`
  - Rain: `rainy/481_{img,baseline,pred}.png` and
    `rainy/ac_teasor_rainy.png`
- Processing: panels were resized uniformly from 576 × 386 px to 536 × 359 px
  and assembled on a white background. The PNG is lossless; the WebP uses
  quality 94.

This asset deliberately says **Low-light**, matching the Camera-ready paper.
If the navigation/tab text says **Night**, keep the distinction intentional or
rename both consistently after author approval.

## Fresh shared-scale comparison assets

Source root:
`../../verification/paper_visual_reconstruction/runs/recoverable_20/samples/cases/`

Every model image comes from `models/<model>/shared_spectral_r.png`. Within a
case, DA v1, DA v2, DepthAnything-AC, and DA-W use one shared metric-depth range
and the same `Spectral_r` colormap. This makes them suitable for visual sliders;
do not substitute the individually min-maxed `paper_minmax_spectral_r.png`
files.

| Page label | Run case | Dataset/condition | Export size | Shared depth range |
| --- | --- | --- | --- | --- |
| Snow | `supp_qualitative_9_degraded` | KITTI-C snow | 1242 × 375 | 4.1881–80.0 m |
| Fog | `supp_qualitative_997_degraded` | KITTI-C fog | 1224 × 370 | 5.0748–80.0 m |
| Night | `teaser_night_4_img` | NuScenes Night | 768 × 384 | 4.8166–80.0 m |
| Rain | `supp_qualitative_248_degraded` | DrivingStereo rain | 881 × 400 | 8.2213–80.0 m |

Filename mapping:

| Website filename | Run source |
| --- | --- |
| `input` | `source_rgb.png` |
| `dav1` | `models/dav1/shared_spectral_r.png` |
| `dav2` | `models/dav2/shared_spectral_r.png` |
| `daac` | `models/daac/shared_spectral_r.png` |
| `daw` | `models/ours/shared_spectral_r.png` |

All five files in each weather folder have exactly the same pixel dimensions.
The Snow input was resized from 640 × 192 to 1242 × 375, and the Fog input from
640 × 192 to 1224 × 370, solely so a three-layer `Input | DA v2 | DA-W` viewer
can align them. Night and Rain retained their native dimensions. Prediction
PNGs were not otherwise rescaled. WebP files use quality 95.

The run manifest records DepthAnything-AC as the official v2 configuration
with intermediate layers `[2, 5, 8, 11]`:
`../../verification/paper_visual_reconstruction/runs/recoverable_20/run_manifest.json`.

## Pipeline

- Source:
  `../../verification/paper_visual_reconstruction/reference_camera_ready/images/DAW.pdf`
- Preferred output: `framework/pipeline.svg` (vector, text converted to paths)
- Raster fallbacks: `framework/pipeline.png` and `.webp`, **2400 × 818 px**
- Processing: page 1 of the Camera-ready vector PDF was rendered with
  PyMuPDF at 2400 px width. The WebP uses quality 94.

`DA-W-release/evaluate.py` is evaluation code and was not used as a pipeline
image source.

## Paper-reported result tables

The live page displays only `real-adverse-weather-clean.{png,webp}` (**2400 ×
1284 px**). It was compiled from a temporary Camera-ready LaTeX copy with only
the Method-column `\cite{...}` markers removed. Method names, metric values,
table structure, and green ranking highlights were not edited. The original
Camera-ready source was not modified.

The three original paper exports below are retained as archives and are no
longer loaded by the page.

The three result tables were exported from a local Tectonic build of
`../../Weather_Conditioned_Depth_Anything_ECCV_2026___Camera_Ready_.zip`.
The build used the Camera-ready `main.tex`, bibliography, ECCV class, and all
paper assets unchanged. In a temporary build copy only, the incompatible
`axessibility` package was disabled; this does not alter the tables. The older
anonymous `../../11783_Weather_Conditioned_Dept.pdf` was not used.

| Website asset | LaTeX label | Export size |
| --- | --- | --- |
| `real-adverse-weather-clean.{png,webp}` | `tab:real_low_quality` (citations omitted) | 2400 × 1284 |
| `real-adverse-weather.{png,webp}` | `tab:real_low_quality` | 2400 × 1227 |
| `kitti-c.{png,webp}` | `tab:kittic_synthetic` | 2400 × 921 |
| `clean-benchmarks.{png,webp}` | `tab:general_benchmark_results` | 2400 × 1014 |

These are paper-reported results, not a claim that every number has been
reproduced by the public release. Replace them if the official proceedings PDF
changes any value or formatting.

Reproduction helpers are stored in
`../../tools/real-adverse-weather-no-citations.patch` and
`../../tools/export_real_adverse_weather_clean.py`.

## Video comparisons

The live page uses four reviewed `Input | DA V2 | DA-W` videos. Every deployable
MP4 and poster is **1920 × 360 px**, uses the same three equal-width columns,
and is presented without web-side cropping or stretching.

| Page label | Video | Selected source | Duration |
| --- | --- | --- | ---: |
| Snow | `video/snow.mp4` | Pexels snowstorm highway, reviewed 17.5–21.5 s window | 4 s |
| Fog | `video/fog.mp4` | Pexels foggy highway, screening-v2 23.5–27.5 s window | 4 s |
| Low-light | `video/low-light.mp4` | Boreas dynamic candidate 01, frames 2851–3090 | 8 s |
| Rain | `video/rain.mp4` | Expanded Pexels search, highway-truck 27–31 s window | 4 s |

The Low-light video was center-cropped vertically from the reviewed 1920 × 600
Boreas composite to remove its white title bar and match the other videos. It
was not horizontally cropped, so all three 640 px columns remain intact. Panel
labels were added after the crop. The other three MP4 files retain their
reviewed 1920 × 360 composites. All four use H.264 and `yuv420p` for browser
compatibility, and each JPEG poster is taken from the corresponding deployed
video.

The clips show independent per-frame image inference and do not establish
temporal consistency. Relative-depth colors are visualizations rather than a
shared absolute metric scale across models or time. Source credits and the
method caveat are displayed in the live video section.

The older `video/video-poster.png` and `.webp` files are retained for provenance
but are no longer loaded by the page.

## Publication checks before GitHub Pages deployment

1. Verify that each underlying dataset permits redistribution of example
   frames on a public project page, and add dataset attribution where required.
   The DA-W release documentation already warns that several datasets have
   separate non-commercial or redistribution terms.
2. Keep the fresh shared-scale predictions for interactive comparisons. The
   Camera-ready teaser is an archived paper figure and should not be mixed into
   those sliders.
3. Verify the table exports against the official proceedings PDF when it is
   released.
4. Keep all four deployed videos at identical dimensions and browser-compatible
   H.264/`yuv420p` encoding when clips are replaced.
