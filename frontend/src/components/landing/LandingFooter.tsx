import React from "react";

export default function LandingFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "40px clamp(16px, 4vw, 48px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 20,
        maxWidth: "76rem",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#10B981" stroke="#10B981" />
        </svg>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 14 }}>Shipr</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)", marginLeft: 16 }}>
          Engineered by <a href="https://github.com/pankaj-raikar" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold" style={{ color: "var(--primary)" }}>Pankaj Raikar</a>
        </span>
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {[
          { label: "GitHub", href: "https://github.com/pankaj-raikar/shipr" },
          { label: "Docs", href: "https://github.com/pankaj-raikar/shipr#readme" },
          { label: "Architecture", href: "#architecture" },
          { label: "Features", href: "#features" }
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              cursor: "pointer",
              transition: "color 0.2s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            {item.label}
          </a>
        ))}
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)" }}>
        2026 © Pankaj Raikar. All rights reserved.
      </span>
    </footer>
  );
}
