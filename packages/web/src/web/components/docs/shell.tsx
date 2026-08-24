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

  useEffect(() => {
    document.documentElement.setAttribute("data-fds-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (compact) document.documentElement.setAttribute("data-fds-density", "compact");
    else document.documentElement.removeAttribute("data-fds-density");
    localStorage.setItem(DENSITY_KEY, compact ? "compact" : "comfortable");
  }, [compact]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);

  return (
    <div className="d-shell">
      <a className="fds-button d-skip" data-variant="secondary" data-size="sm" href="#content">
        Skip to content
      </a>

      <aside className="d-sidebar">
        <Link href="/" className="d-brand" aria-label="Forefront Design System, home">
          <img className="d-brand-logo" src="/images/forefront-logo.webp" alt="Forefront" width={400} height={58} />
          <span className="d-brand-mark">Design System</span>
          <span className="d-mono d-muted">v{manifest.version}</span>
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
