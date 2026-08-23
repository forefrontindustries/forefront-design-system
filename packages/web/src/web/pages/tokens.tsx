import { useMemo, useState } from "react";
import { Badge, Field, Input } from "@forefront/ui";
import { allTokens, defaultTheme, themeNames, type TokenRow } from "../lib/ds";

const TIER_LABEL: Record<number, string> = { 1: "Primitive", 2: "Contract", 3: "Component" };

export default function TokenExplorer() {
  const [theme, setTheme] = useState<string>(defaultTheme);
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<"all" | "1" | "2" | "3">("all");

  const rows = useMemo(() => allTokens(theme), [theme]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (tier !== "all" && String(row.tier) !== tier) return false;
      if (!needle) return true;
      return (
        row.name.toLowerCase().includes(needle) ||
        row.resolved.toLowerCase().includes(needle) ||
        (row.description ?? "").toLowerCase().includes(needle)
      );
    });
  }, [rows, query, tier]);

  return (
    <>
      <section className="d-hero">
        <p className="d-eyebrow">Foundations</p>
        <h1 className="d-h1">Token explorer</h1>
        <p className="d-lead">
          Every token in the system, read live from the generated model. The alias chain column shows the full path from
          the name a product writes down to the literal it resolves to in the selected theme.
        </p>
      </section>

      <section className="d-section">
        <div className="d-row">
          <div style={{ minWidth: "18rem" }}>
            <Field label="Search" hint="Name, value, or intent.">
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  type="search"
                  placeholder="text-accent, radius, control-height"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              )}
            </Field>
          </div>
          <div>
            <label className="fds-field-label" htmlFor="tier-filter">
              Tier
            </label>
            <select
              id="tier-filter"
              className="fds-input"
              value={tier}
              onChange={(event) => setTier(event.target.value as typeof tier)}
            >
              <option value="all">All tiers</option>
              <option value="1">1 - Primitives</option>
              <option value="2">2 - Semantic contract</option>
              <option value="3">3 - Component</option>
            </select>
          </div>
          <div>
            <label className="fds-field-label" htmlFor="theme-resolve">
              Resolve against
            </label>
            <select
              id="theme-resolve"
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
          </div>
        </div>

        <div className="d-row">
          <Badge tone="info">{filtered.length} shown</Badge>
          <Badge tone="neutral">{rows.length} total</Badge>
          <span className="d-muted d-mono">CSS custom property prefix: --fds-</span>
        </div>

        <div className="d-scroll">
          <table className="d-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Tier</th>
                <th scope="col">Alias chain</th>
                <th scope="col">Resolved</th>
                <th scope="col">Intent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <TokenRowView key={`${row.tier}-${row.name}`} row={row} />
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="d-body d-muted">
            No token matches that search. If a product needs it and it is not here, that is a contribution, not a
            workaround. See the contribution model.
          </p>
        ) : null}
      </section>
    </>
  );
}

function TokenRowView({ row }: { row: TokenRow }) {
  return (
    <tr>
      <td>
        <div className="d-row">
          {row.isColor ? (
            <span className="d-swatch" style={{ background: row.resolved }} aria-hidden="true" />
          ) : null}
          <span className="d-token-name">{row.name}</span>
        </div>
      </td>
      <td>
        <span className="d-tier-pill" data-tier={row.tier}>
          {TIER_LABEL[row.tier]}
        </span>
      </td>
      <td>
        <span className="d-chain">
          {row.chain.map((hop, index) => (
            <span key={`${hop}-${index}`}>
              {index > 0 ? <span className="d-chain-arrow"> -&gt; </span> : null}
              {hop}
            </span>
          ))}
        </span>
      </td>
      <td className="d-mono">{row.resolved}</td>
      <td>{row.description ?? <span className="d-muted">Structural</span>}</td>
    </tr>
  );
}
