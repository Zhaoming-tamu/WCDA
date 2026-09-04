"use strict";

/*
 * Replace null with a public URL when each resource is ready.
 * Keeping this map here prevents placeholder buttons from pointing to invented links.
 */
const RESOURCE_LINKS = {
  paper: null,
  code: "https://github.com/taco-group/DA-W",
  model: "https://huggingface.co/qgfvadfuvads/DA-W",
  data: null,
};

const WEATHER_CONDITIONS = [
  { id: "snow", label: "Snow" },
  { id: "fog", label: "Fog" },
  { id: "night", label: "Low-light" },
  { id: "rain", label: "Rain" },
];

const BASELINES = [
  { id: "dav1", tabLabel: "vs Depth Anything V1", imageLabel: "Depth Anything V1" },
  { id: "dav2", tabLabel: "vs Depth Anything V2", imageLabel: "Depth Anything V2" },
  { id: "daac", tabLabel: "vs DepthAnything-AC", imageLabel: "DepthAnything-AC" },
];

const comparisonPath = (weatherId, imageName) =>
  `assets/comparisons/${weatherId}/${imageName}.webp`;

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function assetFrame(path, alt, placeholder, className = "") {
  return `
    <div class="asset-frame ${className}">
      <img
        class="asset-image"
        src="${escapeHTML(path)}"
        alt="${escapeHTML(alt)}"
        loading="lazy"
        decoding="async"
      />
      <div class="asset-placeholder" role="img" aria-label="${escapeHTML(placeholder)}">
        <span>${escapeHTML(placeholder)}</span>
        <small>Image export pending</small>
      </div>
    </div>`;
}

function comparisonLayer(position, path, alt, placeholder) {
  return `
    <div class="comparison-layer comparison-layer--${position}">
      <img
        class="asset-image"
        src="${escapeHTML(path)}"
        alt="${escapeHTML(alt)}"
        loading="lazy"
        decoding="async"
      />
      <div class="asset-placeholder" role="img" aria-label="${escapeHTML(placeholder)}">
        <span>${escapeHTML(placeholder)}</span>
      </div>
    </div>`;
}

function renderWeatherPreview() {
  const root = document.querySelector("[data-weather-preview]");
  if (!root) return;
  root.replaceChildren();

  WEATHER_CONDITIONS.forEach((weather) => {
    const headingId = `weather-preview-${weather.id}`;

    root.insertAdjacentHTML(
      "beforeend",
      `<article
        class="weather-preview-row"
        aria-labelledby="${headingId}"
      >
        <h3 class="weather-preview-label" id="${headingId}">${escapeHTML(weather.label)}</h3>
        <div class="preview-card">
          <div
            class="comparison-stage comparison-stage--triple"
            data-comparison="triple"
            aria-label="${escapeHTML(weather.label)} three-way comparison"
          >
            ${comparisonLayer(
              "right",
              comparisonPath(weather.id, "daw"),
              `DA-W depth prediction for the ${weather.label.toLowerCase()} example`,
              "DA-W",
            )}
            ${comparisonLayer(
              "middle",
              comparisonPath(weather.id, "dav2"),
              `Depth Anything V2 prediction for the ${weather.label.toLowerCase()} example`,
              "Depth Anything V2",
            )}
            ${comparisonLayer(
              "left",
              comparisonPath(weather.id, "input"),
              `Input image under ${weather.label.toLowerCase()} conditions`,
              "Input",
            )}
            <button
              class="comparison-handle"
              data-handle="left"
              type="button"
              role="slider"
              aria-label="Input and Depth Anything V2 boundary"
              aria-valuemin="5"
              aria-valuemax="83"
              aria-valuenow="33"
            ></button>
            <button
              class="comparison-handle"
              data-handle="right"
              type="button"
              role="slider"
              aria-label="Depth Anything V2 and DA-W boundary"
              aria-valuemin="17"
              aria-valuemax="95"
              aria-valuenow="67"
            ></button>
            <div class="comparison-legend comparison-legend--three" aria-hidden="true">
              <span>Input</span><span>DA V2</span><span>DA-W</span>
            </div>
          </div>
        </div>
      </article>`,
    );
  });
}

function renderBaselineComparison() {
  const root = document.querySelector("[data-baseline-comparison]");
  if (!root) return;

  const tabList = root.querySelector(".tab-list");
  const panelContainer = root.querySelector(".tab-panels");

  BASELINES.forEach((baseline, baselineIndex) => {
    const tabId = `baseline-tab-${baseline.id}`;
    const panelId = `baseline-panel-${baseline.id}`;
    const selected = baselineIndex === 0;

    tabList.insertAdjacentHTML(
      "beforeend",
      `<button
        class="tab-button"
        id="${tabId}"
        type="button"
        role="tab"
        aria-selected="${selected}"
        aria-controls="${panelId}"
        tabindex="${selected ? "0" : "-1"}"
      >${escapeHTML(baseline.tabLabel)}</button>`,
    );

    const cards = WEATHER_CONDITIONS.map(
      (weather) => `
        <article
          class="comparison-card"
        >
          <h3>${escapeHTML(weather.label)}</h3>
          <div class="input-preview">
            <span class="input-label">Input</span>
            ${assetFrame(
              comparisonPath(weather.id, "input"),
              `Input image under ${weather.label.toLowerCase()} conditions`,
              `${weather.label} input`,
            )}
          </div>
          <div
            class="comparison-stage comparison-stage--pair"
            data-comparison="pair"
            aria-label="${escapeHTML(baseline.imageLabel)} and DA-W comparison for ${escapeHTML(weather.label)}"
          >
            ${comparisonLayer(
              "right",
              comparisonPath(weather.id, "daw"),
              `DA-W depth prediction for the ${weather.label.toLowerCase()} example`,
              "DA-W",
            )}
            ${comparisonLayer(
              "left",
              comparisonPath(weather.id, baseline.id),
              `${baseline.imageLabel} depth prediction for the ${weather.label.toLowerCase()} example`,
              baseline.imageLabel,
            )}
            <button
              class="comparison-handle"
              data-handle="single"
              type="button"
              role="slider"
              aria-label="${escapeHTML(baseline.imageLabel)} and DA-W boundary"
              aria-valuemin="5"
              aria-valuemax="95"
              aria-valuenow="50"
            ></button>
            <div class="comparison-legend comparison-legend--two" aria-hidden="true">
              <span>${escapeHTML(baseline.imageLabel)}</span><span>DA-W</span>
            </div>
          </div>
        </article>`,
    ).join("");

    panelContainer.insertAdjacentHTML(
      "beforeend",
      `<div
        class="tab-panel"
        id="${panelId}"
        role="tabpanel"
        aria-labelledby="${tabId}"
        ${selected ? "" : "hidden"}
      >
        <div class="comparison-table-head" aria-hidden="true">
          <span>Weather</span>
          <span>Input</span>
          <span>${escapeHTML(baseline.imageLabel)} ↔ DA-W</span>
        </div>
        <div class="comparison-grid">${cards}</div>
      </div>`,
    );
  });
}

function setupTabs(root) {
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;

  function selectTab(nextTab, moveFocus = false) {
    tabs.forEach((tab) => {
      const selected = tab === nextTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
    if (moveFocus) nextTab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        selectTab(tabs[nextIndex], true);
      }
    });
  });
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function setupComparison(stage) {
  const type = stage.dataset.comparison;
  const handles = Array.from(stage.querySelectorAll(".comparison-handle"));
  const values = type === "triple" ? { left: 33, right: 67 } : { single: 50 };
  const minimumGap = 12;

  function updateLabelPositions() {
    if (type === "triple") {
      stage.style.setProperty("--label-1", `${values.left / 2}%`);
      stage.style.setProperty("--label-2", `${(values.left + values.right) / 2}%`);
      stage.style.setProperty("--label-3", `${(values.right + 100) / 2}%`);
    } else {
      stage.style.setProperty("--label-1", `${values.single / 2}%`);
      stage.style.setProperty("--label-2", `${(values.single + 100) / 2}%`);
    }
  }

  function limitsFor(handleName) {
    if (handleName === "left") return [5, values.right - minimumGap];
    if (handleName === "right") return [values.left + minimumGap, 95];
    return [5, 95];
  }

  function setValue(handleName, rawValue) {
    const [minimum, maximum] = limitsFor(handleName);
    const nextValue = clamp(rawValue, minimum, maximum);
    values[handleName] = nextValue;

    const property = handleName === "single" ? "--split" : `--split-${handleName}`;
    stage.style.setProperty(property, `${nextValue}%`);

    const handle = stage.querySelector(`[data-handle="${handleName}"]`);
    if (handle) {
      handle.setAttribute("aria-valuemin", String(Math.round(minimum)));
      handle.setAttribute("aria-valuemax", String(Math.round(maximum)));
      handle.setAttribute("aria-valuenow", String(Math.round(nextValue)));
      handle.setAttribute("aria-valuetext", `${Math.round(nextValue)} percent from the left`);
    }

    if (type === "triple") {
      const otherName = handleName === "left" ? "right" : "left";
      const other = stage.querySelector(`[data-handle="${otherName}"]`);
      const [otherMin, otherMax] = limitsFor(otherName);
      if (other) {
        other.setAttribute("aria-valuemin", String(Math.round(otherMin)));
        other.setAttribute("aria-valuemax", String(Math.round(otherMax)));
      }
    }

    updateLabelPositions();
  }

  function percentageAt(clientX) {
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width) return 50;
    return ((clientX - bounds.left) / bounds.width) * 100;
  }

  handles.forEach((handle) => {
    const handleName = handle.dataset.handle;

    handle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      handle.setPointerCapture(event.pointerId);
      setValue(handleName, percentageAt(event.clientX));
    });

    handle.addEventListener("pointermove", (event) => {
      if (handle.hasPointerCapture(event.pointerId)) {
        setValue(handleName, percentageAt(event.clientX));
      }
    });

    handle.addEventListener("pointerup", (event) => {
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    });

    handle.addEventListener("keydown", (event) => {
      const steps = {
        ArrowLeft: -1,
        ArrowDown: -1,
        ArrowRight: 1,
        ArrowUp: 1,
        PageDown: -10,
        PageUp: 10,
      };
      let nextValue;

      if (Object.hasOwn(steps, event.key)) {
        nextValue = values[handleName] + steps[event.key];
      } else if (event.key === "Home") {
        [nextValue] = limitsFor(handleName);
      } else if (event.key === "End") {
        [, nextValue] = limitsFor(handleName);
      } else {
        return;
      }

      event.preventDefault();
      setValue(handleName, nextValue);
    });
  });

  stage.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".comparison-handle")) return;
    const nextValue = percentageAt(event.clientX);
    const handleName =
      type === "pair"
        ? "single"
        : Math.abs(nextValue - values.left) <= Math.abs(nextValue - values.right)
          ? "left"
          : "right";
    setValue(handleName, nextValue);
    stage.querySelector(`[data-handle="${handleName}"]`)?.focus({ preventScroll: true });
  });

  Object.entries(values).forEach(([handleName, value]) => setValue(handleName, value));
}

function setupImageFallbacks() {
  document.querySelectorAll(".asset-image").forEach((image) => {
    const container = image.closest(".asset-frame, .comparison-layer");
    const placeholder = container?.querySelector(":scope > .asset-placeholder");
    if (placeholder) placeholder.setAttribute("aria-hidden", "true");

    const markMissing = () => {
      container?.classList.add("is-missing");
      if (placeholder) placeholder.setAttribute("aria-hidden", "false");
    };

    image.addEventListener("error", markMissing, { once: true });
    image.addEventListener(
      "load",
      () => {
        container?.classList.remove("is-missing");
        if (placeholder) placeholder.setAttribute("aria-hidden", "true");
      },
      { once: true },
    );

    if (image.complete && image.naturalWidth === 0) markMissing();
  });
}

function setupResources() {
  document.querySelectorAll("[data-resource]").forEach((link) => {
    const key = link.dataset.resource;
    const url = RESOURCE_LINKS[key];
    const status = link.querySelector("small");

    if (typeof url === "string" && url.trim()) {
      link.href = url.trim();
      link.removeAttribute("aria-disabled");
      link.removeAttribute("title");
      if (/^https?:\/\//i.test(url)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      if (status) status.textContent = "View";
    } else {
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", (event) => event.preventDefault());
    }
  });
}

function setupVideos() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-showcase-video]").forEach((video) => {
    const shell = video.closest(".weather-video-shell");
    const markUnavailable = () => shell?.classList.add("is-unavailable");

    video.addEventListener("error", markUnavailable);
    video.querySelector("source")?.addEventListener("error", markUnavailable);

    if (reduceMotion) {
      video.autoplay = false;
      video.pause();
    }
  });
}

function setupNavigation() {
  const nav = document.querySelector(".site-nav");
  const toggle = nav?.querySelector(".nav-toggle");
  if (!nav || !toggle) return;

  const close = () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll(".nav-links a").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 740) close();
  });
}

function setupCitationCopy() {
  const button = document.querySelector("[data-copy-bibtex]");
  const bibtex = document.getElementById("bibtex");
  if (!button || !bibtex) return;

  button.addEventListener("click", async () => {
    const value = bibtex.textContent.trim();
    let copied = false;

    try {
      await navigator.clipboard.writeText(value);
      copied = true;
    } catch (_error) {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      copied = document.execCommand("copy");
      textarea.remove();
    }

    if (copied) {
      const original = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1600);
    }
  });
}

function init() {
  renderWeatherPreview();
  renderBaselineComparison();
  document.querySelectorAll(".tab-interface").forEach(setupTabs);
  document.querySelectorAll(".comparison-stage").forEach(setupComparison);
  setupImageFallbacks();
  setupResources();
  setupVideos();
  setupNavigation();
  setupCitationCopy();
}

init();
