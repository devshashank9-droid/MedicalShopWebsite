"use client";

import React, { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";

interface MedicinePiece {
  id: number;
  x: string;
  y: string;
  scale: number;
  depth: number;
  rotate: number;
  duration: number;
  delay: number;
  kind:
    | "blister-emerald"
    | "blister-amber"
    | "blister-round"
    | "blister-teal"
    | "capsule-emerald"
    | "capsule-teal"
    | "capsule-amber"
    | "tablet-scored";
}

const MEDICINE_PIECES: MedicinePiece[] = [
  // Translucent Blister Packs
  {
    id: 1,
    x: "2%",
    y: "8%",
    scale: 1.05,
    depth: 22,
    rotate: -24,
    duration: 9,
    delay: 0,
    kind: "blister-emerald",
  },
  {
    id: 2,
    x: "80%",
    y: "10%",
    scale: 1.0,
    depth: -25,
    rotate: 22,
    duration: 10,
    delay: 0.4,
    kind: "blister-amber",
  },
  {
    id: 3,
    x: "77%",
    y: "66%",
    scale: 1.1,
    depth: 26,
    rotate: -18,
    duration: 9.5,
    delay: 0.7,
    kind: "blister-round",
  },
  {
    id: 4,
    x: "3%",
    y: "66%",
    scale: 0.95,
    depth: -20,
    rotate: 28,
    duration: 8.8,
    delay: 0.3,
    kind: "blister-teal",
  },

  // 3D Two-Tone Capsules & Scored Tablets
  {
    id: 5,
    x: "22%",
    y: "18%",
    scale: 0.9,
    depth: -16,
    rotate: -38,
    duration: 7.2,
    delay: 0.2,
    kind: "capsule-emerald",
  },
  {
    id: 6,
    x: "71%",
    y: "24%",
    scale: 0.85,
    depth: 18,
    rotate: 32,
    duration: 7.8,
    delay: 0.6,
    kind: "capsule-teal",
  },
  {
    id: 7,
    x: "14%",
    y: "44%",
    scale: 0.95,
    depth: 24,
    rotate: 18,
    duration: 6.8,
    delay: 0.9,
    kind: "tablet-scored",
  },
  {
    id: 8,
    x: "83%",
    y: "44%",
    scale: 0.9,
    depth: -22,
    rotate: -25,
    duration: 7.5,
    delay: 0.5,
    kind: "tablet-scored",
  },
  {
    id: 9,
    x: "25%",
    y: "78%",
    scale: 0.85,
    depth: 19,
    rotate: 42,
    duration: 8.2,
    delay: 0.8,
    kind: "capsule-amber",
  },
  {
    id: 10,
    x: "68%",
    y: "82%",
    scale: 0.85,
    depth: -17,
    rotate: -32,
    duration: 7.6,
    delay: 0.1,
    kind: "capsule-emerald",
  },
  {
    id: 11,
    x: "48%",
    y: "12%",
    scale: 0.75,
    depth: 14,
    rotate: 14,
    duration: 6.9,
    delay: 1.1,
    kind: "tablet-scored",
  },
  {
    id: 12,
    x: "49%",
    y: "88%",
    scale: 0.8,
    depth: -15,
    rotate: -20,
    duration: 7.4,
    delay: 0.4,
    kind: "tablet-scored",
  },
];

function MedicineArtwork({ kind }: { kind: MedicinePiece["kind"] }) {
  switch (kind) {
    case "blister-emerald":
    case "blister-amber":
    case "blister-teal": {
      const capColor =
        kind === "blister-amber"
          ? "#d97706"
          : kind === "blister-teal"
          ? "#0d9488"
          : "#059669";
      return (
        <svg
          width="190"
          height="130"
          viewBox="0 0 190 130"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="4"
            width="182"
            height="122"
            rx="14"
            className="fill-slate-200/55 stroke-slate-400/50 dark:fill-slate-800/45 dark:stroke-slate-600/45"
            strokeWidth="1.5"
          />
          <line
            x1="95"
            y1="8"
            x2="95"
            y2="122"
            className="stroke-slate-400/35 dark:stroke-slate-600/35"
            strokeDasharray="3 3"
          />
          {[22, 55, 88].map((py, rIdx) =>
            [24, 108].map((px, cIdx) => (
              <g key={`${rIdx}-${cIdx}`}>
                <rect
                  x={px - 4}
                  y={py - 4}
                  width="66"
                  height="26"
                  rx="13"
                  className="fill-white/45 stroke-slate-400/45 dark:fill-slate-700/35 dark:stroke-slate-500/40"
                  strokeWidth="1.2"
                />
                <path
                  d={`M${px + 10} ${py} H${px + 29} V${py + 18} H${px + 10} A9 9 0 0 1 ${px + 10} ${py} Z`}
                  fill={capColor}
                  fillOpacity="0.65"
                />
                <path
                  d={`M${px + 29} ${py} H${px + 48} A9 9 0 0 1 ${px + 48} ${py + 18} H${px + 29} V${py} Z`}
                  className="fill-white/85 dark:fill-slate-200/75"
                />
                <line
                  x1={px + 10}
                  y1={py + 4.5}
                  x2={px + 46}
                  y2={py + 4.5}
                  stroke="white"
                  strokeOpacity="0.65"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            ))
          )}
        </svg>
      );
    }

    case "blister-round":
      return (
        <svg
          width="176"
          height="126"
          viewBox="0 0 176 126"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="4"
            width="168"
            height="118"
            rx="14"
            className="fill-slate-200/55 stroke-slate-400/50 dark:fill-slate-800/45 dark:stroke-slate-600/45"
            strokeWidth="1.5"
          />
          {[36, 90].map((cy, rIdx) =>
            [36, 88, 140].map((cx, cIdx) => (
              <g key={`${rIdx}-${cIdx}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="20"
                  className="fill-white/40 stroke-slate-400/45 dark:fill-slate-700/35 dark:stroke-slate-500/40"
                  strokeWidth="1.2"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r="15"
                  className="fill-white/85 stroke-slate-300/60 dark:fill-slate-200/75 dark:stroke-slate-400/40"
                  strokeWidth="1"
                />
                <line
                  x1={cx - 11}
                  y1={cy}
                  x2={cx + 11}
                  y2={cy}
                  className="stroke-slate-400/60 dark:stroke-slate-500/60"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            ))
          )}
        </svg>
      );

    case "capsule-emerald":
    case "capsule-teal":
    case "capsule-amber": {
      const topColor =
        kind === "capsule-amber"
          ? "#d97706"
          : kind === "capsule-teal"
          ? "#0f766e"
          : "#047857";
      return (
        <svg
          width="96"
          height="46"
          viewBox="0 0 96 46"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="8"
            y="11"
            width="80"
            height="28"
            rx="14"
            className="fill-slate-900/10 dark:fill-black/30"
          />
          <path
            d="M22 8 H48 V36 H22 A14 14 0 0 1 22 8 Z"
            fill={topColor}
            fillOpacity="0.72"
          />
          <path
            d="M48 8 H74 A14 14 0 0 1 74 36 H48 V8 Z"
            className="fill-white/90 dark:fill-slate-200/80"
          />
          <rect
            x="8"
            y="8"
            width="80"
            height="28"
            rx="14"
            className="stroke-slate-300/60 dark:stroke-slate-500/40"
            strokeWidth="1.2"
          />
          <line
            x1="21"
            y1="14"
            x2="73"
            y2="14"
            stroke="white"
            strokeOpacity="0.75"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    case "tablet-scored":
    default:
      return (
        <svg
          width="66"
          height="66"
          viewBox="0 0 66 66"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="33"
            cy="36"
            r="25"
            className="fill-slate-900/10 dark:fill-black/30"
          />
          <circle
            cx="33"
            cy="32"
            r="25"
            className="fill-white/90 stroke-slate-300/70 dark:fill-slate-200/80 dark:stroke-slate-500/40"
            strokeWidth="1.5"
          />
          <circle
            cx="33"
            cy="32"
            r="21.5"
            className="stroke-slate-200/70 dark:stroke-slate-400/30"
            strokeWidth="1"
          />
          <line
            x1="12"
            y1="32"
            x2="54"
            y2="32"
            className="stroke-slate-400/70 dark:stroke-slate-500/70"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function ParallaxMedicinePiece({
  item,
  smoothX,
  smoothY,
}: {
  item: MedicinePiece;
  smoothX: ReturnType<typeof useSpring>;
  smoothY: ReturnType<typeof useSpring>;
}) {
  const offsetX = useTransform(smoothX, [-1, 1], [-item.depth, item.depth]);
  const offsetY = useTransform(smoothY, [-1, 1], [-item.depth, item.depth]);

  return (
    <motion.div
      style={{
        left: item.x,
        top: item.y,
        x: offsetX,
        y: offsetY,
        scale: item.scale,
      }}
      className="pointer-events-none absolute opacity-45 blur-[0.4px] select-none dark:opacity-30"
    >
      <motion.div
        initial={{ rotate: item.rotate, y: 0 }}
        animate={{
          y: [-9, 9, -9],
          rotate: [item.rotate - 4, item.rotate + 4, item.rotate - 4],
        }}
        transition={{
          duration: item.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: item.delay,
        }}
      >
        <MedicineArtwork kind={item.kind} />
      </motion.div>
    </motion.div>
  );
}

export default function InteractiveMedicineBg() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const cursorPxX = useMotionValue(-500);
  const cursorPxY = useMotionValue(-500);

  const smoothX = useSpring(pointerX, { stiffness: 65, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 65, damping: 22 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      pointerX.set(normX);
      pointerY.set(normY);
      cursorPxX.set(e.clientX);
      cursorPxY.set(e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [pointerX, pointerY, cursorPxX, cursorPxY]);

  const spotlightBg = useMotionTemplate`radial-gradient(450px circle at ${cursorPxX}px ${cursorPxY}px, rgba(16, 185, 129, 0.13), transparent 80%)`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Interactive Cursor Spotlight */}
      <motion.div className="absolute inset-0" style={{ background: spotlightBg }} />

      {/* Soft Ambient Corner Glows */}
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-500/10" />
      <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/10" />

      {/* Translucent Blister Packs, Capsules & Scored Tablets */}
      {MEDICINE_PIECES.map((item) => (
        <ParallaxMedicinePiece
          key={item.id}
          item={item}
          smoothX={smoothX}
          smoothY={smoothY}
        />
      ))}

      {/* Center Radial Softener so Foreground Content Stays 100% Crisp */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_55%_at_50%_46%,rgba(255,255,255,0.72),transparent_100%)] dark:bg-[radial-gradient(ellipse_62%_55%_at_50%_46%,rgba(2,6,23,0.72),transparent_100%)]" />
    </div>
  );
}