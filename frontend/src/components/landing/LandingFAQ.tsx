import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FadeUp, SectionLabel } from "./LandingHelpers";

const faqs = [
  {
    q: "What frontend frameworks does Shipr support?",
    a: "Shipr supports any framework with a standard npm build script — React, Vue, Svelte, Next.js (static export), Vite, and plain HTML. As long as npm run build produces a dist or build folder, Shipr handles it seamlessly.",
  },
  {
    q: "How does the wildcard subdomain routing work?",
    a: "The Shipr request router acts as an edge reverse proxy configured for wildcard subdomains (*.shipr.live). When a request arrives, it extracts the subdomain prefix as the deployment ID and streams the corresponding build artifacts directly from Cloudflare R2 object storage with proper MIME types.",
  },
  {
    q: "Can I scale the build workers horizontally?",
    a: "Yes — the architecture is designed for horizontal scaling. Multiple worker instances consume from the same Redis queue simultaneously via BRPOP, processing independent deployment jobs in parallel without race conditions or contention.",
  },
  {
    q: "Where are build artifacts stored?",
    a: "All build artifacts are uploaded to Cloudflare R2 / AWS S3 object storage. The request router fetches files directly from storage on each request, streaming HTML, CSS, JS, and static assets with near-zero latency.",
  },
  {
    q: "Is Shipr open source?",
    a: "Shipr is an open-source, local-first distributed deployment engine engineered by Pankaj Raikar to demonstrate asynchronous worker orchestration, event streaming with Redis, and wildcard edge proxy routing. The codebase is on GitHub under the MIT license.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <FadeUp key={i} delay={i * 0.04}>
            <div
              style={{
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
              }}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 0",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                  }}
                >
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: "var(--primary)",
                    fontSize: 20,
                    marginLeft: 16,
                    flexShrink: 0,
                    fontWeight: 300,
                  }}
                >
                  +
                </motion.span>
              </div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text-muted)",
                        lineHeight: 1.75,
                        paddingBottom: 20,
                      }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>
        );
      })}
    </div>
  );
}

export default function LandingFAQ() {
  return (
    <section id="faq" style={{ position: "relative", padding: "clamp(48px, 6vw, 96px) clamp(20px, 4vw, 48px)" }}>
      <FadeUp>
        <div style={{ marginBottom: 40, display: "flex", flexDirection: "column", gap: 8 }}>
          <SectionLabel text="// FAQ" />
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              fontFamily: "var(--font-body)",
            }}
          >
            Frequently asked questions.
          </h2>
        </div>
      </FadeUp>
      <div style={{ maxWidth: "48rem" }}>
        <FAQ />
      </div>
    </section>
  );
}
