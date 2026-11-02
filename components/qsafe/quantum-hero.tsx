"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, Sparkles, Zap, Lock, RefreshCw, CheckCircle2, Flame } from "lucide-react";

/**
 * Web Audio Synthesizer for Glacial Titanium Ambient Pad & Sub-Bass Pulse
 */
function toggleTitaniumAudio(audioRef: { ctx: AudioContext | null; timer: number | null }) {
  if (audioRef.ctx) {
    if (audioRef.timer) window.clearInterval(audioRef.timer);
    audioRef.ctx.close().catch(() => {});
    audioRef.ctx = null;
    audioRef.timer = null;
    return false;
  }

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    audioRef.ctx = ctx;

    const playLoop = () => {
      if (!audioRef.ctx) return;
      const now = ctx.currentTime;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-16, now);
      comp.ratio.setValueAtTime(5, now);
      comp.connect(ctx.destination);

      const chords = [
        { t: 0.0, d: 1.6, freqs: [146.83, 220.0, 293.66, 369.99, 587.33] },
        { t: 1.6, d: 1.6, freqs: [130.81, 196.0, 261.63, 329.63, 523.25] },
        { t: 3.2, d: 1.6, freqs: [110.0, 164.81, 220.0, 277.18, 440.0] },
        { t: 4.8, d: 1.7, freqs: [146.83, 220.0, 293.66, 440.0, 659.25] },
      ];

      chords.forEach((c) => {
        c.freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = idx % 2 === 0 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(f, now + c.t);
          osc.detune.setValueAtTime((idx - 2) * 5, now + c.t);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(520, now + c.t);
          filter.frequency.exponentialRampToValueAtTime(2100, now + c.t + c.d * 0.7);

          gain.gain.setValueAtTime(0.0001, now + c.t);
          gain.gain.exponentialRampToValueAtTime(0.038 / Math.sqrt(c.freqs.length), now + c.t + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + c.t + c.d);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(comp);

          osc.start(now + c.t);
          osc.stop(now + c.t + c.d + 0.05);
        });
      });

      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(92, now);
      sub.frequency.exponentialRampToValueAtTime(38, now + 1.4);
      subGain.gain.setValueAtTime(0.2, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);
      sub.connect(subGain);
      subGain.connect(comp);
      sub.start(now);
      sub.stop(now + 1.5);
    };

    playLoop();
    audioRef.timer = window.setInterval(playLoop, 6500);
    return true;
  } catch {
    return false;
  }
}

/**
 * Build a subdivided Geodesic Sphere mesh (vertices + triangular faces + edges)
 * for the 3D Brushed-Metal Quantum Core
 */
function createGeodesicMesh() {
  const phi = (1 + Math.sqrt(5)) / 2;
  const baseVerts: [number, number, number][] = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ].map(([x, y, z]) => {
    const l = Math.hypot(x, y, z);
    return [x / l, y / l, z / l];
  });

  const baseFaces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  // Subdivide each triangle once into 4 geodesic facets (80 facets total)
  const verts = baseVerts.slice();
  const midCache = new Map<string, number>();

  const getMid = (i1: number, i2: number): number => {
    const key = i1 < i2 ? `${i1}_${i2}` : `${i2}_${i1}`;
    const existing = midCache.get(key);
    if (existing !== undefined) return existing;
    const v1 = verts[i1];
    const v2 = verts[i2];
    const mx = (v1[0] + v2[0]) / 2;
    const my = (v1[1] + v2[1]) / 2;
    const mz = (v1[2] + v2[2]) / 2;
    const len = Math.hypot(mx, my, mz);
    const idx = verts.length;
    verts.push([mx / len, my / len, mz / len]);
    midCache.set(key, idx);
    return idx;
  };

  const faces: [number, number, number][] = [];
  for (const [a, b, c] of baseFaces) {
    const ab = getMid(a, b);
    const bc = getMid(b, c);
    const ca = getMid(c, a);
    faces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
  }

  return { verts, faces };
}

/**
 * Full-Screen Pure Titanium & Glacial Ice Launch Stage
 * Features a 3D Floating Brushed-Metal Geodesic Quantum Sphere + Sweeping Orbital Rings
 */
export function QuantumLaunchIntro({ ca }: { ca?: string }) {
  const displayAddress = ca || "DGXACBwbUqRKRVR1TQojZBoRuV2TZJ8wVnQSuLKm2nJJ";
  const pillLabel = ca ? "$QSAFE CA" : "PROGRAM ID";
  const [exited, setExited] = useState(false);
  const [entering, setEntering] = useState(false);
  const [viewMode, setViewMode] = useState<"spin" | "orbit" | "vault">("spin");
  const [copied, setCopied] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [clock, setClock] = useState("00:12:00");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<{ ctx: AudioContext | null; timer: number | null }>({
    ctx: null,
    timer: null,
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(now.toTimeString().slice(0, 8));
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current.timer) clearInterval(audioRef.current.timer);
      if (audioRef.current.ctx) audioRef.current.ctx.close().catch(() => {});
    };
  }, []);

  const handleEnterVault = () => {
    setEntering(true);
    if (!audioPlaying) {
      const started = toggleTitaniumAudio(audioRef.current);
      setAudioPlaying(started);
      setTimeout(() => {
        if (audioRef.current.ctx) {
          toggleTitaniumAudio(audioRef.current);
          setAudioPlaying(false);
        }
      }, 2800);
    }
    setTimeout(() => {
      setExited(true);
    }, 1050);
  };

  const handleCopyCa = () => {
    navigator.clipboard?.writeText(displayAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    if (exited) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const { verts, faces } = createGeodesicMesh();

    const particles = Array.from({ length: 75 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.5 + 0.4,
      phase: Math.random() * Math.PI * 2,
      ice: Math.random() > 0.45,
    }));

    let t = 0;

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      t += entering ? 0.048 : viewMode === "orbit" ? 0.022 : 0.011;

      // 1. Deep Obsidian Slate & Glacial Ice Spotlight Backdrop
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.32, 10, w * 0.5, h * 0.48, Math.max(w, h) * 0.82);
      bg.addColorStop(0, "#15232d");
      bg.addColorStop(0.35, "#0c141b");
      bg.addColorStop(0.7, "#070b0f");
      bg.addColorStop(1, "#040608");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // 2. Subtle Glacial Ice & Platinum Dust
      for (const p of particles) {
        p.phase += 0.018;
        const a = 0.16 + 0.48 * Math.abs(Math.sin(p.phase));
        ctx.fillStyle = p.ice
          ? `rgba(169, 222, 255, ${a})`
          : `rgba(232, 240, 247, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Lower Vault Floor Ring & Threshold Line (matching reference screenshot composition)
      const floorY = h * 0.86;
      const floorGlow = ctx.createRadialGradient(w * 0.5, floorY, 10, w * 0.5, floorY, w * 0.4);
      floorGlow.addColorStop(0, "rgba(169, 222, 255, 0.12)");
      floorGlow.addColorStop(0.55, "rgba(30, 56, 74, 0.08)");
      floorGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = floorGlow;
      ctx.fillRect(0, h * 0.68, w, h * 0.32);

      ctx.save();
      ctx.translate(w * 0.5, floorY);
      ctx.scale(1, 0.36);
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(w, 900) * 0.19, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(169, 222, 255, 0.2)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-w * 0.35, 0);
      ctx.lineTo(w * 0.35, 0);
      ctx.strokeStyle = "rgba(169, 222, 255, 0.09)";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(215, 238, 255, 0.42)";
      ctx.fill();
      ctx.restore();

      // 4. Central 3D Floating Brushed-Metal Geodesic Sphere above Title
      const isMobile = w <= 640;
      const isShort = h <= 720;
      const cx = w * 0.5;
      const cy = isMobile
        ? Math.max(128, Math.min(h * (isShort ? 0.22 : 0.24), 196))
        : Math.min(h * 0.26, 242);
      const radius = isMobile
        ? Math.max(40, Math.min(w * 0.125, h * 0.072, 56))
        : Math.min(w, h) * 0.088;

      // Ambient Glacial Ice Halo behind Sphere
      const coreGlow = ctx.createRadialGradient(cx, cy, 4, cx, cy, radius * 2.5);
      coreGlow.addColorStop(0, "rgba(169, 222, 255, 0.36)");
      coreGlow.addColorStop(0.5, "rgba(90, 150, 195, 0.12)");
      coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Sweeping Orbital Swoosh Rings around the 3D Sphere
      const orbitCount = viewMode === "orbit" ? 4 : 2;
      const orbitScale = isMobile ? 1.56 : 1.78;
      for (let r = 0; r < orbitCount; r++) {
        ctx.save();
        ctx.translate(cx, cy + radius * 0.36);
        ctx.rotate((r % 2 === 0 ? -0.24 : 0.22) + (viewMode === "orbit" ? Math.sin(t + r) * 0.15 : 0));
        ctx.scale(1, 0.32);

        const orbitR = radius * (orbitScale + r * (isMobile ? 0.22 : 0.28));
        ctx.beginPath();
        ctx.arc(0, 0, orbitR, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(169, 222, 255, 0.22)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.beginPath();
        const startA = t * (r % 2 === 0 ? 1.1 : -0.9) + r * 1.7;
        ctx.arc(0, 0, orbitR, startA, startA + 1.85);
        ctx.strokeStyle =
          r % 2 === 0 ? "rgba(244, 248, 251, 0.9)" : "rgba(169, 222, 255, 0.88)";
        ctx.lineWidth = isMobile ? 1.6 : 1.9;
        ctx.stroke();
        ctx.restore();
      }

      if (viewMode === "vault") {
        // Mechanical 34-Chain Titanium Vault Lock Wheel
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.04, 0, Math.PI * 2);
        ctx.fillStyle = "#0b1319";
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#c8d8e4";
        ctx.stroke();

        for (let i = 0; i < 34; i++) {
          const a = (i / 34) * Math.PI * 2 + t * 0.4;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * radius * 0.78, Math.sin(a) * radius * 0.78);
          ctx.lineTo(Math.cos(a) * radius * 0.96, Math.sin(a) * radius * 0.96);
          ctx.strokeStyle = i % 2 === 0 ? "#a9deff" : "#e8f1f8";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Inner Geometric Q Lock Core
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
        ctx.strokeStyle = "#a9deff";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(radius * 0.14, radius * 0.14);
        ctx.lineTo(radius * 0.48, radius * 0.48);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      } else {
        // 3D Brushed-Metal Geodesic Sphere with Specular Facet Shading
        const cosY = Math.cos(t * 0.85);
        const sinY = Math.sin(t * 0.85);
        const cosX = Math.cos(t * 0.45);
        const sinX = Math.sin(t * 0.45);

        const rotVerts = verts.map(([vx, vy, vz]) => {
          const x1 = vx * cosY - vz * sinY;
          const z1 = vz * cosY + vx * sinY;
          const y2 = vy * cosX - z1 * sinX;
          const z2 = z1 * cosX + vy * sinX;
          return {
            x: x1,
            y: y2,
            z: z2,
            px: cx + x1 * radius * 0.96,
            py: cy + y2 * radius * 0.96,
          };
        });

        // Sort front-facing triangular facets by depth
        const visibleFaces = faces
          .map(([i0, i1, i2]) => {
            const v0 = rotVerts[i0];
            const v1 = rotVerts[i1];
            const v2 = rotVerts[i2];
            // Normal vector (for unit sphere, average of vertices approximates face normal)
            const nx = (v0.x + v1.x + v2.x) / 3;
            const ny = (v0.y + v1.y + v2.y) / 3;
            const nz = (v0.z + v1.z + v2.z) / 3;
            return { v0, v1, v2, nx, ny, nz };
          })
          .filter((f) => f.nz > -0.08)
          .sort((a, b) => a.nz - b.nz);

        // Directional studio key light from top-left-front
        const lx = -0.45;
        const ly = -0.55;
        const lz = 0.7;

        for (const f of visibleFaces) {
          const dot = Math.max(0, f.nx * lx + f.ny * ly + f.nz * lz);
          const spec = Math.pow(dot, 4);
          const rVal = Math.round(16 + dot * 135 + spec * 95);
          const gVal = Math.round(26 + dot * 155 + spec * 90);
          const bVal = Math.round(36 + dot * 175 + spec * 75);

          ctx.beginPath();
          ctx.moveTo(f.v0.px, f.v0.py);
          ctx.lineTo(f.v1.px, f.v1.py);
          ctx.lineTo(f.v2.px, f.v2.py);
          ctx.closePath();
          ctx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(185, 225, 255, ${0.18 + dot * 0.45})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }

      // 5. Arching "SOLANA" Crest Curve above Title (matching screenshot composition)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy + radius * (isMobile ? 1.82 : 1.95), radius * (isMobile ? 0.74 : 0.82), Math.PI * 1.18, Math.PI * 1.82);
      ctx.strokeStyle = "rgba(210, 232, 248, 0.68)";
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [exited, viewMode, entering]);

  if (exited) {
    return (
      <button
        type="button"
        onClick={() => {
          setEntering(false);
          setExited(false);
        }}
        className="qs-reopen-stage-btn"
      >
        <span>◈</span> MAIN STAGE INTRO
      </button>
    );
  }

  return (
    <div className={`qs-ucl-stage ${entering ? "qs-ucl-entering" : ""}`}>
      {/* PHYSICAL TITANIUM BLAST DOORS THAT SLIDE OPEN ON ENTER */}
      <div className="qs-blast-doors" aria-hidden="true">
        <div className="qs-blast-door left" />
        <div className="qs-blast-seam" />
        <div className="qs-blast-door right" />
      </div>

      <canvas ref={canvasRef} className="qs-ucl-canvas" />

      {/* TOP BROADCAST TELEMETRY BAR */}
      <div className="qs-ucl-topbar">
        <div className="qs-ucl-panel left">
          <span className="qs-live-dot" />
          <div>
            <span className="qs-panel-muted">MAINNET LIVE // </span>
            <strong>SOLANA × $QSAFE</strong>
          </div>
        </div>

        <div className="qs-ucl-panel center">
          <span className="qs-gold-star">◈</span>
          <strong>POST-QUANTUM VAULT : SHA-256 SHIELD ARMED</strong>
          <span className="qs-gold-star">◈</span>
        </div>

        <div className="qs-ucl-panel right">
          <span>{clock}{" // VAULT"}</span>
          <span className="qs-ready-sub">READY</span>
        </div>
      </div>

      {/* CENTER STAGE CONTENT (Clean Floating 3D Geodesic Sphere + Monument Title) */}
      <div className="qs-ucl-center">
        <div className="qs-ucl-sphere-spacer" />

        <div className="qs-ucl-crest-arch">SOLANA</div>
        <h1 className="qs-ucl-title">
          QUANTUM
          <span>SAFE</span>
        </h1>

        {/* Clean Titanium & Ice Divider Line */}
        <div className="qs-ucl-divider">
          <span className="qs-divider-line" />
          <span className="qs-divider-stars">◈ ◈ ◈</span>
          <span className="qs-divider-text">RFC 8554 LM-OTS · 34-HASH CUSTODY</span>
          <span className="qs-divider-stars">◈ ◈ ◈</span>
          <span className="qs-divider-line" />
        </div>

        {/* Corner-Bracketed Primary Enter Button */}
        <button
          type="button"
          onClick={handleEnterVault}
          className="qs-ucl-enter-btn"
        >
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
          <span className="qs-gold-star">◈</span>
          <span>ENTER THE VAULT</span>
          <span className="qs-arrow">→</span>
        </button>

        {/* CA / Program Bar */}
        <div className="qs-ucl-ca-bar">
          <span className="qs-ca-pill">{pillLabel}</span>
          <span className="qs-ca-text">{displayAddress}</span>
          <button type="button" onClick={handleCopyCa} className="qs-ca-copy">
            {copied ? "COPIED" : "COPY"}
          </button>
          <a
            href="/vault"
            onClick={(e) => {
              e.preventDefault();
              handleEnterVault();
            }}
            className="qs-ca-launch"
          >
            LAUNCH APP ↗
          </a>
          <a
            href="https://x.com/TheQuantumSafe"
            target="_blank"
            rel="noreferrer"
            className="qs-ca-launch"
          >
            𝕏 @TheQuantumSafe ↗
          </a>
        </div>

        <div className="qs-ucl-subline">
          1 WALLET DEPOSITS IN // <strong>ONLY 34-CHAIN SHA-256 SIGNATURES WITHDRAW OUT</strong>
        </div>
      </div>

      {/* BOTTOM DOCK */}
      <div className="qs-ucl-bottombar">
        <div className="qs-ucl-bottom-panel stats">
          <span>34 HASH CHAINS // </span>
          <strong>1,124-BYTE LM-OTS SIGNATURE</strong>
        </div>

        <div className="qs-ucl-mode-tabs" role="tablist" aria-label="3D Stage View Mode">
          <button
            type="button"
            className={viewMode === "spin" ? "active" : ""}
            onClick={() => setViewMode("spin")}
          >
            ◈ 3D SPIN
          </button>
          <button
            type="button"
            className={viewMode === "orbit" ? "active" : ""}
            onClick={() => setViewMode("orbit")}
          >
            HASH ORBIT
          </button>
          <button
            type="button"
            className={viewMode === "vault" ? "active" : ""}
            onClick={() => setViewMode("vault")}
          >
            VAULT VIEW
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            const playing = toggleTitaniumAudio(audioRef.current);
            setAudioPlaying(playing);
          }}
          className={`qs-ucl-bottom-panel anthem ${audioPlaying ? "playing" : ""}`}
        >
          <span>♫</span>
          <strong>{audioPlaying ? "MUTE VAULT AUDIO" : "PLAY VAULT AUDIO"}</strong>
        </button>
      </div>
    </div>
  );
}

/**
 * Interactive 3D Brushed-Metal Geodesic Sphere + Glacial Ice Hero Backdrop
 */
export function ChampionsStarballCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [overdrive, setOverdrive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const syncSize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    syncSize();
    window.addEventListener("resize", syncSize);

    const { verts, faces } = createGeodesicMesh();

    const nodes = Array.from({ length: 34 }, (_, i) => ({
      angle: (i / 34) * Math.PI * 2,
      radius: 150 + (i % 4) * 38,
      yOffset: ((i % 7) - 3) * 32,
      speed: (0.004 + (i % 4) * 0.0014) * (i % 2 === 0 ? 1 : -1),
      ice: i % 2 === 0,
      label: i % 3 === 0 ? "SHA-256" : i % 3 === 1 ? "LM-OTS" : `CHAIN #${i + 1}`,
    }));

    let t = 0;

    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      t += overdrive ? 0.028 : 0.01;

      const bgGrad = ctx.createRadialGradient(w * 0.72, h * 0.48, 20, w * 0.65, h * 0.5, Math.max(w, h) * 0.9);
      bgGrad.addColorStop(0, "#14222c");
      bgGrad.addColorStop(0.38, "#0b1319");
      bgGrad.addColorStop(0.75, "#070b0e");
      bgGrad.addColorStop(1, "#05080a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const isMobile = w <= 640;
      const cx = w > 960 ? w * 0.71 : w * 0.5;
      const cy = w > 960 ? h * 0.5 : isMobile ? h * 0.54 : h * 0.62;
      const sphereR = Math.min(w, h) * (w > 960 ? 0.22 : isMobile ? 0.23 : 0.18);

      // Orbital Swoosh Rings
      for (let ring = 0; ring < 3; ring++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * (ring % 2 === 0 ? 0.35 : -0.25) + ring * 0.8);
        ctx.scale(1, 0.36 + ring * 0.1);
        ctx.beginPath();
        ctx.arc(0, 0, sphereR * (1.35 + ring * 0.2), 0, Math.PI * 2);
        ctx.strokeStyle =
          ring === 0
            ? "rgba(244, 248, 251, 0.36)"
            : "rgba(169, 222, 255, 0.28)";
        ctx.lineWidth = ring === 0 ? 1.8 : 1.1;
        ctx.setLineDash(ring === 1 ? [8, 10] : [18, 12]);
        ctx.stroke();
        ctx.restore();
      }

      // 3D Geodesic Core
      const cosY = Math.cos(t * 0.8);
      const sinY = Math.sin(t * 0.8);
      const cosX = Math.cos(t * 0.42);
      const sinX = Math.sin(t * 0.42);

      const rotVerts = verts.map(([vx, vy, vz]) => {
        const x1 = vx * cosY - vz * sinY;
        const z1 = vz * cosY + vx * sinY;
        const y2 = vy * cosX - z1 * sinX;
        const z2 = z1 * cosX + vy * sinX;
        return {
          x: x1,
          y: y2,
          z: z2,
          px: cx + x1 * sphereR * 0.9,
          py: cy + y2 * sphereR * 0.9,
        };
      });

      const visibleFaces = faces
        .map(([i0, i1, i2]) => {
          const v0 = rotVerts[i0];
          const v1 = rotVerts[i1];
          const v2 = rotVerts[i2];
          const nx = (v0.x + v1.x + v2.x) / 3;
          const ny = (v0.y + v1.y + v2.y) / 3;
          const nz = (v0.z + v1.z + v2.z) / 3;
          return { v0, v1, v2, nx, ny, nz };
        })
        .filter((f) => f.nz > -0.05)
        .sort((a, b) => a.nz - b.nz);

      for (const f of visibleFaces) {
        const dot = Math.max(0, f.nx * -0.45 + f.ny * -0.55 + f.nz * 0.7);
        const spec = Math.pow(dot, 4);
        const rVal = Math.round(14 + dot * 130 + spec * 90);
        const gVal = Math.round(24 + dot * 150 + spec * 88);
        const bVal = Math.round(34 + dot * 170 + spec * 75);

        ctx.beginPath();
        ctx.moveTo(f.v0.px, f.v0.py);
        ctx.lineTo(f.v1.px, f.v1.py);
        ctx.lineTo(f.v2.px, f.v2.py);
        ctx.closePath();
        ctx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(169, 222, 255, ${0.16 + dot * 0.4})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Orbiting Hash Nodes
      const nodeOrbitScale = isMobile ? 0.56 : 1;
      nodes.forEach((n, idx) => {
        if (isMobile && idx % 2 !== 0) return;
        n.angle += n.speed * (overdrive ? 2.6 : 1);
        const bx = cx + Math.cos(n.angle) * (n.radius * nodeOrbitScale);
        const bz = Math.sin(n.angle);
        const by = cy + n.yOffset * nodeOrbitScale + bz * (isMobile ? 16 : 28);
        const alpha = (isMobile ? 0.16 : 0.24) + (bz + 1) * (isMobile ? 0.24 : 0.32);

        ctx.save();
        ctx.translate(bx, by);
        const bw = isMobile ? 52 : 62;
        const bh = isMobile ? 19 : 22;
        ctx.fillStyle = `rgba(12, 22, 30, ${alpha})`;
        ctx.strokeStyle = n.ice
          ? `rgba(169, 222, 255, ${alpha + 0.2})`
          : `rgba(200, 216, 228, ${alpha + 0.2})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(244, 248, 251, ${Math.min(1, alpha + 0.3)})`;
        ctx.font = isMobile
          ? "600 7.5px 'JetBrains Mono', monospace"
          : "600 8.5px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label, 0, 0.5);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", syncSize);
    };
  }, [overdrive]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="hero-image qs-starball-canvas"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => setOverdrive((v) => !v)}
        className={`qs-yolo-toggle ${overdrive ? "active" : ""}`}
      >
        <Flame size={14} />
        <span>{overdrive ? "OVERDRIVE: 34-CHAIN PULSE" : "ACCELERATE HASH ORBIT"}</span>
      </button>
    </>
  );
}

/**
 * Interactive Visualizers replacing all old static/video clips (`<Clip />` and `<Card />`)
 */
export function QuantumVisualizer({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 34);
    }, 650);
    return () => clearInterval(timer);
  }, []);

  if (name === "key-turns-to-ash") {
    return (
      <div className={`qs-viz-card ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">GEN #{104 + (step % 5)}</span>
          <span className="qs-badge-live">SINGLE-USE BURN</span>
        </div>
        <div className="qs-hash-stream">
          <div className="qs-hash-row active">
            <span>KEY[{step % 5}]</span>
            <code>0x9f4a…{((step * 7919) % 65535).toString(16).padStart(4, "0")}</code>
            <span className="qs-tag-ok">ACTIVE</span>
          </div>
          <div className="qs-hash-row burned">
            <span>KEY[{(step + 4) % 5}]</span>
            <code>0x3c18…burned</code>
            <span className="qs-tag-burn">RETIRED</span>
          </div>
        </div>
      </div>
    );
  }

  if (name === "signed-withdrawal-form") {
    return (
      <div className={`qs-viz-card ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">PAYLOAD LOCK</span>
          <span className="qs-badge-live">1,124 BYTES</span>
        </div>
        <div className="qs-payload-box">
          <div><span>ASSET</span><strong>SOL (Native)</strong></div>
          <div><span>AMOUNT</span><strong>420.00 SOL</strong></div>
          <div><span>DEST</span><strong>ColdVault…9xQ</strong></div>
          <div className="qs-sig-seal">
            <CheckCircle2 size={13} /> LM-OTS SHA-256 VERIFIED
          </div>
        </div>
      </div>
    );
  }

  if (name === "34-chain-ring") {
    return (
      <div className={`qs-viz-card ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">RFC 8554 LM-OTS</span>
          <span className="qs-badge-live">CHAIN {step + 1} / 34</span>
        </div>
        <div className="qs-chains-grid">
          {Array.from({ length: 34 }, (_, i) => (
            <span
              key={i}
              className={`qs-chain-cell ${i <= step ? "verified" : ""}`}
              title={`SHA-256 Chain #${i + 1}`}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (name === "trusted-addresses") {
    return (
      <div className={`qs-viz-card ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">WHITELISTED POCKETS</span>
          <span className="qs-badge-live">0s DELAY</span>
        </div>
        <div className="qs-trust-list">
          <div className="qs-trust-item"><span>#1 Ledger Cold</span><b>INSTANT</b></div>
          <div className="qs-trust-item"><span>#2 Trezor Vault</span><b>INSTANT</b></div>
          <div className="qs-trust-item"><span>#3 Multisig Safe</span><b>INSTANT</b></div>
          <div className="qs-trust-item"><span>#4 Offline Node</span><b>INSTANT</b></div>
        </div>
      </div>
    );
  }

  if (name === "waiting-period-timer") {
    return (
      <div className={`qs-viz-card ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">TIMELOCK SHIELD</span>
          <span className="qs-badge-live">24:00:00</span>
        </div>
        <div className="qs-timer-display">
          <div className="qs-clock">23:59:{String(59 - (step % 60)).padStart(2, "0")}</div>
          <span className="qs-stop-pill">1-CLICK CANCEL ARMED</span>
        </div>
      </div>
    );
  }

  if (name === "stage-01-core" || name === "door-03-the-report") {
    return (
      <div className={`qs-viz-card qs-stage-viz ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">STAGE 01 · RFC 8554 ENGINE</span>
          <span className="qs-badge-live">34 × 256-BIT CHAINS</span>
        </div>
        <div className="qs-chains-grid">
          {Array.from({ length: 34 }, (_, i) => (
            <span
              key={i}
              className={`qs-chain-cell ${i <= step ? "verified" : ""}`}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <div className="qs-sig-seal">
          <CheckCircle2 size={13} /> LM-OTS_SHA256_N32_W8 · ZERO CURVES
        </div>
      </div>
    );
  }

  if (name === "stage-02-airlock") {
    return (
      <div className={`qs-viz-card qs-stage-viz ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">STAGE 02 · SOLANA AIRLOCK</span>
          <span className="qs-badge-live">MAINNET PDA</span>
        </div>
        <div className="qs-payload-box">
          <div><span>PROGRAM ID</span><strong>DGXACB…m2nJJ</strong></div>
          <div><span>UPGRADE AUTH</span><strong>RENOUNCED (NONE)</strong></div>
          <div><span>DEPOSIT VALVE</span><strong>ANY WALLET → PDA</strong></div>
          <div><span>WITHDRAW GATE</span><strong>1,124B LM-OTS ONLY</strong></div>
        </div>
      </div>
    );
  }

  if (name === "stage-03-recovery") {
    return (
      <div className={`qs-viz-card qs-stage-viz ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">STAGE 03 · OFFLINE KEYGEN</span>
          <span className="qs-badge-live">AIR-GAPPED KIT</span>
        </div>
        <div className="qs-payload-box">
          <div><span>KDF ENGINE</span><strong>scrypt (N=32768)</strong></div>
          <div><span>CIPHER</span><strong>AES-256-GCM</strong></div>
          <div><span>STOP FILE</span><strong>PRE-SIGNED CANCEL</strong></div>
          <div><span>CLI RUNTIME</span><strong>qsafe-cli.mjs</strong></div>
        </div>
      </div>
    );
  }

  if (name === "door-01-watch" || name === "stage-04-watch") {
    return (
      <div className={`qs-viz-card qs-stage-viz ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">STAGE 04 · QUANTUM WATCH</span>
          <span className="qs-badge-live">SLOT #{318492000 + step * 2}</span>
        </div>
        <div className="qs-hash-stream">
          <div className="qs-hash-row active">
            <span>VAULT PDA MONITOR</span>
            <code>0 KEYS HELD · READ-ONLY</code>
            <span className="qs-tag-ok">SEALED</span>
          </div>
          <div className="qs-hash-row">
            <span>ANNOUNCE WATCHER</span>
            <code>24H COUNTDOWN HOOK</code>
            <span className="qs-tag-ok">ARMED</span>
          </div>
        </div>
      </div>
    );
  }

  if (name === "door-05-build-on-qsafe" || name === "stage-05-terminals") {
    return (
      <div className={`qs-viz-card qs-stage-viz ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">STAGE 05 · TERMINAL SWEEP</span>
          <span className="qs-badge-live">AUTO-AIRLOCK</span>
        </div>
        <div className="qs-payload-box">
          <div><span>TRADE PNL</span><strong>+{(12.5 + (step % 8) * 4.2).toFixed(1)} SOL</strong></div>
          <div><span>SWEEP HOOK</span><strong>1-CLICK / AUTO CPI</strong></div>
          <div><span>DESTINATION</span><strong>QuantumSafe PDA</strong></div>
          <div className="qs-sig-seal">
            <CheckCircle2 size={13} /> ZERO PRIVATE KEY EXPOSURE
          </div>
        </div>
      </div>
    );
  }

  if (name === "door-02-signer-drawn" || name === "door-04-signer-built" || name === "stage-06-hardware") {
    return (
      <div className={`qs-viz-card qs-stage-viz ${className}`}>
        <div className="qs-viz-top">
          <span className="qs-badge-gold">STAGE 06 · HARDWARE SIGNER</span>
          <span className="qs-badge-live">STATELESS QR / USB-C</span>
        </div>
        <div className="qs-payload-box">
          <div><span>SECURE ELEMENT</span><strong>SHA-256 HASH CORE</strong></div>
          <div><span>TRANSPORT</span><strong>OPTICAL QR / RAW HID</strong></div>
          <div><span>EPOCH TREE</span><strong>HSS / LMS HIERARCHY</strong></div>
          <div className="qs-sig-seal">
            <CheckCircle2 size={13} /> AIR-GAPPED SILICON ENCLAVE
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`qs-plate-backdrop ${className}`} aria-hidden="true">
      <div className="qs-plate-glow" />
      <div className="qs-plate-grid" />
    </div>
  );
}

/**
 * Interactive "Post-Quantum Vault & Drainer Stress Test Simulator"
 */
export function StackPaperSimulator() {
  const [walletStack, setWalletStack] = useState(50);
  const [vaultStack, setVaultStack] = useState(950);
  const [status, setStatus] = useState<string>(
    "QUANTUM AIRLOCK SEALED · 34-CHAIN SHA-256 SHIELD ACTIVE"
  );
  const [attacked, setAttacked] = useState(false);

  const sweepToVault = () => {
    if (walletStack <= 5) {
      setStatus("HOT WALLET ALREADY SWEPT INTO QUANTUM SAFE!");
      return;
    }
    const move = walletStack - 5;
    setWalletStack(5);
    setVaultStack((v) => v + move);
    setAttacked(false);
    setStatus(`SWEPT +${move} SOL INTO QUANTUM SAFE! 34-HASH LOCK ENGAGED.`);
  };

  const tradeWin = () => {
    setWalletStack((w) => w + 250);
    setAttacked(false);
    setStatus("PROFIT REALIZED: +250 SOL IN HOT WALLET — SWEEP TO QUANTUM AIRLOCK NOW!");
  };

  const simulateDrainer = () => {
    const lost = walletStack;
    setWalletStack(0);
    setAttacked(true);
    setStatus(
      `COMPROMISED SIGNATURE! DRAINER TOOK ${lost} SOL FROM HOT WALLET — YOUR ${vaultStack} SOL IN QUANTUM SAFE REMAINS UNTOUCHED!`
    );
  };

  return (
    <div className="qs-simulator">
      <div className="qs-sim-header">
        <div>
          <span className="qs-badge-gold">LIVE BREACH SIMULATION</span>
          <h3>Post-Quantum Custody · Stress-Test Terminal</h3>
        </div>
        <div className="qs-sim-total">
          <span>TOTAL PROTECTED + ACTIVE</span>
          <strong>{(walletStack + vaultStack).toLocaleString()} SOL</strong>
        </div>
      </div>

      <div className="qs-sim-columns">
        <div className={`qs-sim-box hot ${attacked ? "drained" : ""}`}>
          <div className="qs-sim-box-head">
            <span>ACTIVE TRADING WALLET (ED25519)</span>
            <Zap size={16} />
          </div>
          <div className="qs-sim-balance">{walletStack.toLocaleString()} SOL</div>
          <p>Standard elliptic-curve hot key. Exposed to phishing & quantum key recovery.</p>
          <div className="qs-stack-bars">
            {Array.from({ length: Math.min(12, Math.ceil(walletStack / 40)) }, (_, i) => (
              <span key={i} className="qs-bar green" />
            ))}
          </div>
        </div>

        <div className="qs-sim-controls">
          <button type="button" className="button light" onClick={tradeWin}>
            <Sparkles size={15} /> Realize Trade Profit (+250 SOL)
          </button>
          <button type="button" className="button qs-gold-btn" onClick={sweepToVault}>
            <Shield size={15} /> Sweep to Quantum Safe →
          </button>
          <button type="button" className="button ghost qs-danger-btn" onClick={simulateDrainer}>
            <Lock size={15} /> Trigger Malicious Drainer
          </button>
          <button
            type="button"
            className="qs-reset-link"
            onClick={() => {
              setWalletStack(50);
              setVaultStack(950);
              setAttacked(false);
              setStatus("SIMULATOR RESET · QUANTUM AIRLOCK SEALED");
            }}
          >
            <RefreshCw size={12} /> Reset Simulation
          </button>
        </div>

        <div className="qs-sim-box cold">
          <div className="qs-sim-box-head">
            <span>QUANTUM SAFE VAULT (34-HASH LOCK)</span>
            <Shield size={16} />
          </div>
          <div className="qs-sim-balance gold">{vaultStack.toLocaleString()} SOL</div>
          <p>Protected by RFC 8554 LM-OTS one-time SHA-256 signatures. Wallet key cannot open it.</p>
          <div className="qs-stack-bars">
            {Array.from({ length: Math.min(16, Math.ceil(vaultStack / 100)) }, (_, i) => (
              <span key={i} className="qs-bar gold" />
            ))}
          </div>
        </div>
      </div>

      <div className={`qs-sim-status ${attacked ? "alert" : ""}`}>
        {status}
      </div>
    </div>
  );
}
