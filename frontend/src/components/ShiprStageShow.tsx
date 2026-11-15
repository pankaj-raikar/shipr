import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Window, Bar, Badge, Spinner } from "../stageshow";
import "../stageshow/stageshow.css";

interface PipelineStep {
  id: string;
  name: string;
  duration: string;
  status: "pending" | "running" | "completed";
  detail: string;
}

export default function ShiprStageShow() {
  const [activeTab, setActiveTab] = useState<"terminal" | "preview" | "architecture">("terminal");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const steps: PipelineStep[] = [
    {
      id: "clone",
      name: "Git Clone & Ingest",
      duration: "1.2s",
      status: stepIndex >= 1 ? "completed" : stepIndex === 0 ? "running" : "pending",
      detail: "git clone --depth 1 https://github.com/pankaj-raikar/react-showcase.git -> output/a8f10e"
    },
    {
      id: "upload",
      name: "Source Archive -> R2",
      duration: "0.8s",
      status: stepIndex >= 2 ? "completed" : stepIndex === 1 ? "running" : "pending",
      detail: "Uploaded 48 source files to R2 bucket 'shipr-deployments' under prefix 'output/a8f10e/'"
    },
    {
      id: "queue",
      name: "Enqueue Build Job",
      duration: "0.1s",
      status: stepIndex >= 3 ? "completed" : stepIndex === 2 ? "running" : "pending",
      detail: "LPUSH 'build-queue' job: a8f10e | Redis event broadcasted to worker pool"
    },
    {
      id: "build",
      name: "Worker: npm run build",
      duration: "2.4s",
      status: stepIndex >= 4 ? "completed" : stepIndex === 3 ? "running" : "pending",
      detail: "npm install (142 pkgs) & npm run build -> compiled dist/ (340KB static assets)"
    },
    {
      id: "live",
      name: "Subdomain Edge Routing",
      duration: "0.3s",
      status: stepIndex >= 4 ? "completed" : "pending",
      detail: "Artifacts live on wildcard edge proxy: https://a8f10e.shipr.live"
    }
  ];

  const terminalLines = [
    { text: "$ shipr deploy --repo https://github.com/pankaj-raikar/saas-dashboard", color: "#a1a1aa", step: 0 },
    { text: "  ✦ [ingest] Shallow cloning repository (depth=1)... done in 1.1s", color: "#c084fc", step: 0 },
    { text: "  ✦ [storage] Syncing source code to Cloudflare R2 bucket...", color: "#c084fc", step: 1 },
    { text: "  ✦ [queue] Enqueued job 'a8f10e' into Redis build-queue", color: "#818cf8", step: 2 },
    { text: "  ✦ [worker-02] Worker picked up job 'a8f10e'", color: "#38bdf8", step: 3 },
    { text: "  ✦ [worker-02] Executing: npm install && npm run build", color: "#38bdf8", step: 3 },
    { text: "  │  ✓ Built in 412ms | dist/index.html (0.5KB) | dist/assets/index.js (184KB)", color: "#a1a1aa", step: 3 },
    { text: "  ✦ [publish] Copying compiled artifacts to production bucket...", color: "#c084fc", step: 4 },
    { text: "  ✓ [ready] Deployment successful! Subdomain mapped to edge router.", color: "#4ade80", step: 4 },
    { text: "  ↗ Live Sandbox: https://a8f10e.shipr.live", color: "#4ade80", step: 4 }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "56rem", margin: "0 auto" }}>
      {/* Outer ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: "-1px",
          background: "linear-gradient(135deg, rgba(192, 132, 252, 0.25), rgba(56, 189, 248, 0.15), rgba(0, 0, 0, 0))",
          borderRadius: "14px",
          filter: "blur(8px)",
          pointerEvents: "none",
          opacity: 0.6
        }}
      />

      <Window
        url="app.shipr.live/deployments/a8f10e"
        className="shipr-stageshow-window"
        style={{
          background: "#0c0d12",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minHeight: "360px" }}>
          {/* Subheader Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "10px 16px",
              background: "rgba(255, 255, 255, 0.02)",
              flexWrap: "wrap",
              gap: 8
            }}
          >
            {/* View Switcher */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setActiveTab("terminal")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono, monospace)",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "terminal" ? "rgba(192, 132, 252, 0.18)" : "transparent",
                  color: activeTab === "terminal" ? "#c084fc" : "#a1a1aa",
                  transition: "all 0.2s"
                }}
              >
                Pipeline Console
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono, monospace)",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "preview" ? "rgba(74, 222, 128, 0.18)" : "transparent",
                  color: activeTab === "preview" ? "#4ade80" : "#a1a1aa",
                  transition: "all 0.2s"
                }}
              >
                Live Preview ↗
              </button>
              <button
                onClick={() => setActiveTab("architecture")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono, monospace)",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === "architecture" ? "rgba(56, 189, 248, 0.18)" : "transparent",
                  color: activeTab === "architecture" ? "#38bdf8" : "#a1a1aa",
                  transition: "all 0.2s"
                }}
              >
                Orchestration State
              </button>
            </div>

            {/* Play/Pause & Step Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono, monospace)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "#d4d4d8",
                  cursor: "pointer"
                }}
              >
                {isPlaying ? "❚❚ Pause" : "▶ Play Demo"}
              </button>
              <Badge tone={stepIndex >= 4 ? "success" : "neutral"} style={{ fontSize: "11px", padding: "3px 8px" }}>
                {stepIndex >= 4 ? "Live on Edge" : "Deploying..."}
              </Badge>
            </div>
          </div>

          {/* Main Stage Content */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", flex: 1, minHeight: "300px" }}>
            {/* Left Column: Active View */}
            <div style={{ padding: "16px", borderRight: "1px solid rgba(255, 255, 255, 0.06)", overflowY: "auto", maxHeight: "380px" }}>
              <AnimatePresence mode="wait">
                {activeTab === "terminal" && (
                  <motion.div
                    key="terminal"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-mono, monospace)", fontSize: "12px" }}
                  >
                    {terminalLines
                      .filter((l) => l.step <= stepIndex)
                      .map((line, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ color: line.color, lineHeight: "1.7", wordBreak: "break-all" }}
                        >
                          {line.text}
                        </motion.div>
                      ))}
                    {stepIndex < 4 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <Spinner style={{ width: 12, height: 12, color: "#c084fc" }} />
                        <span style={{ color: "#71717a", fontSize: "11px" }}>Processing step {stepIndex + 1} of 5...</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "preview" && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      height: "100%",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "#12131a",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: "11px", color: "#a1a1aa", fontFamily: "var(--font-mono, monospace)" }}>
                          HTTPS // TLS 1.3 // Edge Cached
                        </span>
                        <span style={{ fontSize: "11px", color: "#4ade80", background: "rgba(74, 222, 128, 0.12)", padding: "2px 6px", borderRadius: "4px" }}>
                          HTTP 200 OK (14ms)
                        </span>
                      </div>
                      <h4 style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: 6 }}>
                        SaaS Analytics Dashboard
                      </h4>
                      <p style={{ color: "#a1a1aa", fontSize: "12px", lineHeight: "1.6", marginBottom: 16 }}>
                        Compiled React 19 static bundle served dynamically by Shipr Request Router from Cloudflare R2 object storage.
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <div style={{ fontSize: "10px", color: "#71717a" }}>MONTHLY ACTIVE</div>
                          <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>48,290</div>
                        </div>
                        <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <div style={{ fontSize: "10px", color: "#71717a" }}>EDGE LATENCY</div>
                          <div style={{ fontSize: "18px", fontWeight: 700, color: "#4ade80" }}>18ms</div>
                        </div>
                      </div>
                    </div>
                    <a
                      href="https://github.com/pankaj-raikar/shipr"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        textAlign: "center",
                        padding: "8px",
                        borderRadius: "6px",
                        background: "#c084fc",
                        color: "#000",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                        marginTop: 16
                      }}
                    >
                      Visit Sandbox Subdomain →
                    </a>
                  </motion.div>
                )}

                {activeTab === "architecture" && (
                  <motion.div
                    key="architecture"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "12px" }}
                  >
                    <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <div style={{ color: "#c084fc", fontWeight: 600, marginBottom: 2 }}>Upload Service (Port 3000)</div>
                      <div style={{ color: "#a1a1aa", fontSize: "11px" }}>Shallow Git clone & uploads source files to storage</div>
                    </div>
                    <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <div style={{ color: "#818cf8", fontWeight: 600, marginBottom: 2 }}>Redis 7.0 Queue & Cache</div>
                      <div style={{ color: "#a1a1aa", fontSize: "11px" }}>Job ID queue (LPUSH/BRPOP) & live log buffer with 1h TTL</div>
                    </div>
                    <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <div style={{ color: "#38bdf8", fontWeight: 600, marginBottom: 2 }}>Deploy Worker Pool</div>
                      <div style={{ color: "#a1a1aa", fontSize: "11px" }}>Spawns subprocess build runner and pushes dist/ to R2</div>
                    </div>
                    <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <div style={{ color: "#4ade80", fontWeight: 600, marginBottom: 2 }}>Request Router (Port 3001)</div>
                      <div style={{ color: "#a1a1aa", fontSize: "11px" }}>Wildcard subdomain parser streaming static files directly</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Interactive Pipeline Steps */}
            <div style={{ padding: "16px", background: "rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#71717a", fontFamily: "var(--font-mono, monospace)" }}>
                Pipeline Progress
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    onClick={() => {
                      setStepIndex(idx);
                      setIsPlaying(false);
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      border: idx === stepIndex ? "1px solid rgba(192, 132, 252, 0.4)" : "1px solid rgba(255, 255, 255, 0.04)",
                      background: idx === stepIndex ? "rgba(192, 132, 252, 0.08)" : "rgba(255, 255, 255, 0.015)",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: step.status === "completed" ? "#4ade80" : step.status === "running" ? "#c084fc" : "#52525b"
                          }}
                        />
                        <span style={{ fontSize: "12px", fontWeight: 500, color: idx === stepIndex ? "#fff" : "#a1a1aa" }}>
                          {step.name}
                        </span>
                      </div>
                      <span style={{ fontSize: "10px", fontFamily: "var(--font-mono, monospace)", color: "#71717a" }}>
                        {step.duration}
                      </span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#71717a", fontFamily: "var(--font-mono, monospace)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {step.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
}
