/**
 * @file prerender.mjs
 * Post-build step that writes a static HTML file for every route so GitHub
 * Pages serves them with HTTP 200 instead of falling through to 404.html.
 *
 * Each page is a copy of dist/index.html with route-specific <title>, meta
 * description, social tags, canonical URL and crawlable body content. React
 * still mounts and replaces #root as usual; the static content only exists
 * for search engines and AI crawlers. Also regenerates dist/sitemap.xml.
 *
 * Files are written as `<route>.html` (not `<route>/index.html`) because
 * GitHub Pages serves `/cask/firefox` from `cask/firefox.html` directly,
 * whereas a directory would trigger a 301 to a trailing-slash URL.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE = "https://amit9838.github.io/brewlens";
const DIST = path.resolve(import.meta.dirname, "../dist");

const API = {
  cask: "https://formulae.brew.sh/api/cask.json",
  formula: "https://formulae.brew.sh/api/formula.json",
};

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const link = (route, text) => `<a href="${SITE}/${route}">${esc(text)}</a>`;

const NAV_LINKS = `
      <h2>Explore BrewLens</h2>
      <ul>
        <li>${link("", "BrewLens home — trending Homebrew apps")}</li>
        <li>${link("all", "Browse all Homebrew casks")}</li>
        <li>${link("all?type=formula", "Browse all Homebrew formulae")}</li>
        <li>${link("installation", "How to install Homebrew")}</li>
        <li>${link("analytics", "Homebrew install analytics")}</li>
        <li>${link("about", "About BrewLens")}</li>
      </ul>`;

/** Static (non-package) routes, mirroring the useDocumentMeta calls in each page. */
const STATIC_PAGES = [
  {
    route: "installation",
    title: "How to Install Homebrew on macOS, Linux & WSL | BrewLens",
    description:
      "A step-by-step guide to installing Homebrew on macOS, Linux, and Windows Subsystem for Linux (WSL), plus essential brew commands.",
    body: `
      <h1>How to install Homebrew on macOS, Linux and WSL</h1>
      <p>Homebrew is the missing package manager for macOS and Linux. Install it by running the official installer in your terminal:</p>
      <pre><code>/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code></pre>
      <h2>Add Homebrew to your PATH</h2>
      <p>On Apple Silicon Macs (M1, M2, M3, M4) Homebrew lives in <code>/opt/homebrew</code>:</p>
      <pre><code>eval "$(/opt/homebrew/bin/brew shellenv)"</code></pre>
      <p>On Linux and Windows Subsystem for Linux (WSL) it lives in <code>/home/linuxbrew/.linuxbrew</code>:</p>
      <pre><code>eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"</code></pre>
      <h2>Essential brew commands</h2>
      <ul>
        <li><code>brew install wget</code> — install a formula (command-line tool)</li>
        <li><code>brew install --cask firefox</code> — install a cask (macOS app)</li>
        <li><code>brew update</code> and <code>brew upgrade</code> — update Homebrew and upgrade installed packages</li>
        <li><code>brew search &lt;name&gt;</code> — search packages</li>
        <li><code>brew uninstall &lt;name&gt;</code> — remove a package</li>
        <li><code>brew doctor</code> — diagnose problems with your Homebrew install</li>
      </ul>`,
  },
  {
    route: "all",
    title: "All Homebrew Casks — macOS Apps | BrewLens",
    description:
      "Browse and search every Homebrew cask — GUI apps for macOS. See versions, install commands, download URLs, and checksums.",
    body: `
      <h1>All Homebrew casks and formulae</h1>
      <p>Browse and search every Homebrew cask (macOS GUI apps) and formula (command-line tools and libraries for macOS, Linux and WSL), filter by category, and see versions, install commands, download URLs and checksums.</p>`,
  },
  {
    route: "analytics",
    title: "Homebrew Install Analytics — Trending Casks & Formulae | BrewLens",
    description:
      "See the most-installed Homebrew casks and formulae by install counts over 30, 90, or 365 days, powered by official Homebrew analytics data.",
    body: `
      <h1>Homebrew install analytics</h1>
      <p>The most-installed Homebrew casks and formulae ranked by install counts over the last 30, 90 or 365 days, powered by official Homebrew analytics from formulae.brew.sh.</p>`,
  },
  {
    route: "about",
    title: "About BrewLens — Open-Source Homebrew Explorer",
    description:
      "BrewLens is a free, MIT-licensed, open-source Homebrew explorer by Amit Chaudhary. Learn how it works, its data sources, and how to contribute.",
    body: `
      <h1>About BrewLens</h1>
      <p>BrewLens is a free, MIT-licensed, open-source web interface for Homebrew by Amit Chaudhary. It reads package metadata from the official Homebrew API at formulae.brew.sh and runs entirely in your browser. It never installs anything; it shows the <code>brew install</code> command for you to run.</p>
      <p>Source code: <a href="https://github.com/amit9838/brewlens">github.com/amit9838/brewlens</a></p>`,
  },
];

/** Builds the page for one cask or formula, matching CaskDetail / FormulaeDetail meta. */
const packagePage = (raw, type) => {
  const isCask = type === "cask";
  const token = isCask ? raw.full_token : raw.name;
  const name = (isCask && Array.isArray(raw.name) ? raw.name[0] : raw.name) || token;
  const version = isCask ? raw.version : raw.versions?.stable || "N/A";
  const installCmd = `brew install ${isCask ? "--cask " : ""}${token}`;
  const kind = isCask ? "Cask" : "Formula";

  const status = raw.disabled
    ? `<p><strong>Disabled:</strong> this ${kind.toLowerCase()} is disabled in Homebrew${raw.disable_reason ? ` (${esc(raw.disable_reason)})` : ""}.</p>`
    : raw.deprecated
      ? `<p><strong>Deprecated:</strong> this ${kind.toLowerCase()} is deprecated in Homebrew${raw.deprecation_reason ? ` (${esc(raw.deprecation_reason)})` : ""}.</p>`
      : "";

  const deps = isCask ? [] : (raw.dependencies ?? []);
  const depsHtml = deps.length
    ? `<h2>Dependencies</h2><ul>${deps.map((d) => `<li>${link(`formula/${d}`, d)}</li>`).join("")}</ul>`
    : "";

  return {
    route: `${type}/${token}`,
    title: `${name} — Homebrew ${kind} (${version}) | BrewLens`,
    description: isCask
      ? `${raw.desc ?? name} — install with "${installCmd}". View version, homepage, download URL, and SHA-256 checksum for the ${name} Homebrew cask on BrewLens.`
      : `${raw.desc ?? name} — install with "${installCmd}". View version, homepage, dependencies, and install command for the ${name} Homebrew formula on BrewLens.`,
    body: `
      <h1>${esc(name)} — Homebrew ${kind}</h1>
      <p>${esc(raw.desc || "No description available.")}</p>
      ${status}
      <h2>Install ${esc(name)} with Homebrew</h2>
      <pre><code>${esc(installCmd)}</code></pre>
      <ul>
        <li>Token: <code>${esc(token)}</code></li>
        <li>Version: ${esc(version)}</li>
        ${raw.homepage ? `<li>Homepage: <a href="${esc(raw.homepage)}">${esc(raw.homepage)}</a></li>` : ""}
        ${raw.license ? `<li>License: ${esc(raw.license)}</li>` : ""}
        ${isCask ? "<li>Platform: macOS</li>" : "<li>Platforms: macOS, Linux, Windows (WSL)</li>"}
      </ul>
      ${depsHtml}`,
  };
};

const withCanonical = (html, url) =>
  html.replace("</head>", `  <link rel="canonical" href="${url}" />\n</head>`);

/** Replaces the route-specific parts of the built index.html template. */
const render = (template, { route, title, description, body }) => {
  const url = `${SITE}/${route}`;
  const t = esc(title);
  const d = esc(description);

  return withCanonical(template, url)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description"\s+content=")[^"]*/, `$1${d}`)
    .replace(/(<meta property="og:title"\s+content=")[^"]*/, `$1${t}`)
    .replace(/(<meta property="og:description"\s+content=")[^"]*/, `$1${d}`)
    .replace(/(<meta property="og:url"\s+content=")[^"]*/, `$1${url}`)
    .replace(/(<meta name="twitter:title"\s+content=")[^"]*/, `$1${t}`)
    .replace(/(<meta name="twitter:description"\s+content=")[^"]*/, `$1${d}`)
    .replace(/(<meta name="twitter:url"\s+content=")[^"]*/, `$1${url}`)
    // The FAQ describes the homepage only; repeating it on every page would
    // be flagged as duplicate structured data.
    .replace(/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>\s*/, "")
    .replace(/(<div id="bl-crawlable"[^>]*>)[\s\S]*?(<\/div>)/, `$1${body}\n${NAV_LINKS}\n    $2`);
};

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  return res.json();
};

const main = async () => {
  const template = await readFile(path.join(DIST, "index.html"), "utf8");
  const [casks, formulae] = await Promise.all([fetchJson(API.cask), fetchJson(API.formula)]);

  const pages = [
    ...STATIC_PAGES,
    ...casks.map((c) => packagePage(c, "cask")),
    ...formulae.map((f) => packagePage(f, "formula")),
  ];

  await mkdir(path.join(DIST, "cask"), { recursive: true });
  await mkdir(path.join(DIST, "formula"), { recursive: true });

  // The homepage keeps its own head and body; it only gains a canonical URL.
  await writeFile(path.join(DIST, "index.html"), withCanonical(template, `${SITE}/`));
  for (const page of pages) {
    await writeFile(path.join(DIST, `${page.route}.html`), render(template, page));
  }

  const urls = ["", ...pages.map((p) => p.route)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((r) => `  <url><loc>${esc(`${SITE}/${r}`)}</loc></url>`).join("\n")}
</urlset>
`;
  await writeFile(path.join(DIST, "sitemap.xml"), sitemap);

  console.log(`prerender: wrote ${pages.length} pages (${casks.length} casks, ${formulae.length} formulae) and sitemap.xml`);
};

main().catch((err) => {
  console.error(`prerender: ${err.message}`);
  process.exit(1);
});
