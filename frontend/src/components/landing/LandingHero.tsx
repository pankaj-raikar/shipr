import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import ShiprStageShow from "../ShiprStageShow";

export default function LandingHero() {
  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(56px, 8vw, 80px) clamp(20px, 4vw, 48px) clamp(56px, 8vw, 80px)",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            textAlign: "center",
            maxWidth: "100%",
          }}
        >
          {/* Badge */}
          <motion.a
            href="https://github.com/pankaj-raikar/shipr"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 100,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.02)",
              padding: "5px 14px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.15em",
              textDecoration: "none",
              color: "var(--text-secondary)",
              backdropFilter: "blur(4px)",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--green)",
                animation: "pulse-dot 2s ease infinite",
              }}
            />
            <span style={{ color: "#ffffff67" }}>Open Source • Live on shipr.live</span>
          </motion.a>

          {/* Heading */}
          <div style={{ maxWidth: "5xl" }}>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "clamp(32px, 7vw, 68px)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                textWrap: "balance",
              }}
            >
              Deploy Frontend Apps
              <br />
              <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
                <span
                  style={{
                    background: "linear-gradient(to bottom right, var(--text-primary), rgba(250,250,250,0.6))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  in{" "}
                </span>
                <span style={{ color: "var(--primary)" }}>Seconds</span>
                {/* Underline SVG */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 320 12"
                  style={{
                    position: "absolute",
                    bottom: -14,
                    left: "64%",
                    height: 12,
                    width: "92%",
                    transform: "translateX(-50%)",
                    color: "var(--primary)",
                  }}
                  fill="none"
                >
                  <path
                    d="M2 8 C 80 2, 240 2, 318 8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 400,
                      strokeDashoffset: 400,
                      animation: "landing-draw 1.4s ease 0.9s forwards",
                    }}
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                marginTop: 28,
                maxWidth: 540,
                margin: "28px auto 0",
                fontSize: "clamp(14px, 1.6vw, 15px)",
                lineHeight: 1.7,
                textWrap: "balance",
                color: "var(--text-muted)",
              }}
            >
              Paste any GitHub repository. Shipr clones, builds, and deploys your static frontend to a live edge subdomain — fully automated with asynchronous Redis workers.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              width: "100%",
            }}
          >
            <Link
              to="/deploy"
              className="hero-cta-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "none",
                borderRadius: 6,
                boxShadow: "0 32px 64px -16px #0006, 0 16px 32px -8px #0006, 0 8px 16px -4px #0004, 0 4px 8px -2px #0004, 0 -8px 16px -1px #0003, 0 2px 4px -1px #0004, inset 0 0 0 1px rgba(16, 185, 129, 0.2), inset 0 1px rgba(52, 211, 153, 0.8)",
                background: "var(--primary)",
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 500,
                color: "#000",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#059669";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--primary)";
                e.currentTarget.style.transform = "none";
              }}
            >
              Launch Console
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 16, height: 16, transition: "transform 0.2s" }}>
                <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <motion.a
              href="https://github.com/pankaj-raikar/shipr"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hero-cta-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "none",
                borderRadius: 6,
                boxShadow: "0 32px 64px -16px #0006, 0 16px 32px -8px #0006, 0 8px 16px -4px #0004, 0 4px 8px -2px #0004, 0 -8px 16px -1px #0003, 0 2px 4px -1px #0004, inset 0 0 0 1px #ffffff14, inset 0 1px #fff3",
                background: "rgba(255, 255, 255, 0.16)",
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 500,
                color: "#ffffff",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                backdropFilter: "blur(4px)",
                transition: "all 0.2s",
              }}
            >
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14, color: "#facc15" }}>
                <path d="M8 1.5 9.8 5.2l4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6L8 1.5Z" fill="currentColor" />
              </svg>
              Star on GitHub
            </motion.a>
          </motion.div>

          {/* ═══ Stageshow Interactive Pipeline Visualizer ═══ */}
          <div style={{ width: "100%", maxWidth: "58rem", marginTop: "12px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <ShiprStageShow />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
