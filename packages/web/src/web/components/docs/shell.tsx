import { Switch } from "@forefront/ui";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { defaultTheme, manifest, themeNames } from "../../lib/ds";

const NAV = [
  {
    title: "Start here",
    links: [
      { href: "/", label: "Overview" },
      { href: "/architecture", label: "Architecture" },
      { href: "/learn", label: "Learn track" },
    ],
  },
  {
    title: "Foundations",
    links: [
      { href: "/tokens", label: "Token explorer" },
      { href: "/theming", label: "Theming and density" },
      { href: "/platforms", label: "Multi platform output" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
  {
    title: "Library",
    links: [{ href: "/components", label: "Components" }],
  },
  {
    title: "Operating the system",
    links: [
      { href: "/contribution", label: "Contribution model" },
      { href: "/governance", label: "Governance" },
      { href: "/versioning", label: "Versioning and releases" },
      { href: "/roadmap", label: "Roadmap" },
    ],
  },
];

const THEME_KEY = "fds-theme";
const DENSITY_KEY = "fds-density";

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [theme, setTheme] = useState<string>(() => localStorage.getItem(THEME_KEY) ?? defaultTheme);
  const [compact, setCompact] = useState<boolean>(() => localStorage.getItem(DENSITY_KEY) === "compact");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-fds-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (compact) document.documentElement.setAttribute("data-fds-density", "compact");
    else document.documentElement.removeAttribute("data-fds-density");
    localStorage.setItem(DENSITY_KEY, compact ? "compact" : "comfortable");
  }, [compact]);

  // Navigating closes the drawer, otherwise the panel covers the page you just asked for.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setNavOpen(false);
  }, [location]);

  // Escape closes it, which is the keyboard contract for anything modal over content.
  useEffect(() => {
    if (!navOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  // The drawer scrolls, so the page behind it must not.
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  return (
    <div className="d-shell">
      <a className="fds-button d-skip" data-variant="secondary" data-size="sm" href="#content">
        Skip to content
      </a>

      {/* The scrim only exists while the drawer is open, and only paints below 60rem. */}
      {navOpen ? <button type="button" className="d-nav-scrim" aria-label="Close navigation" onClick={() => setNavOpen(false)} /> : null}

      <aside className="d-sidebar" id="docs-nav" data-open={navOpen ? "true" : "false"}>
        <Link href="/" className="d-brand" aria-label="Forefront Design System, home">
          <img className="d-brand-logo" src="/images/forefront-logo.webp" alt="Forefront" width={400} height={58} />
          <span className="d-brand-mark">Design System</span>
          <span className="d-brand-version">v{manifest.version}</span>
        </Link>

        <nav aria-label="Documentation">
          <div className="d-stack-lg">
            {NAV.map((group) => (
              <div className="d-nav-group" key={group.title}>
                <span className="d-nav-title">{group.title}</span>
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="d-nav-link"
                    aria-current={location === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </nav>

        <div className="d-stack">
          <hr className="d-rule" />
          <a className="d-mono" href="https://github.com/forefrontindustries/forefront-design-system">
            GitHub repo
          </a>
          <a className="d-mono" href="/storybook/index.html">
            Storybook
          </a>
        </div>
      </aside>

      <div className="d-main">
        <header className="d-topbar">
          <button
            type="button"
            className="d-nav-toggle"
            aria-expanded={navOpen}
            aria-controls="docs-nav"
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="d-nav-toggle-bars" aria-hidden="true" data-open={navOpen ? "true" : "false"}>
              <span />
              <span />
              <span />
            </span>
            {navOpen ? "Close" : "Menu"}
          </button>

          <span className="d-topbar-spacer" />

          <label className="fds-field-label" htmlFor="theme-select">
            Theme
          </label>
          <select
            id="theme-select"
            className="fds-input"
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
          >
            {themeNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Switch
            label="Compact density"
            checked={compact}
            onChange={(event) => setCompact(event.target.checked)}
          />
        </header>

        <main className="d-content" id="content">
          {children}
        </main>
      </div>
    </div>
  );
}
