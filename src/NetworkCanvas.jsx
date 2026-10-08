import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion.js";

const LINK_DISTANCE = 150;
const MAX_PULSES = 10;

// Drifting network of nodes; nearby nodes link up and data pulses travel
// along the links. Paused while off screen; drawn once for reduced motion.
export default function NetworkCanvas({ className = "", density = 1, tone = "light" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return undefined;

    const reduced = prefersReducedMotion();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const lineColor = tone === "light" ? "134, 239, 172" : "255, 255, 255";
    let width = 0;
    let height = 0;
    let nodes = [];
    let pulses = [];
    let frame = 0;
    let visible = true;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.round(Math.min(80, (width * height) / 15000) * density);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 1.8,
      }));
      pulses = [];
      if (reduced) draw();
    }

    function spawnPulse() {
      if (nodes.length < 2) return;
      const from = nodes[Math.floor(Math.random() * nodes.length)];
      const to = nodes.find((node) => node !== from &&
        Math.hypot(node.x - from.x, node.y - from.y) < LINK_DISTANCE);
      if (from && to) pulses.push({ from, to, t: 0 });
    }

    function draw() {
      context.clearRect(0, 0, width, height);

      if (!reduced) {
        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }
      }

      context.lineWidth = 1;
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (distance < LINK_DISTANCE) {
            context.strokeStyle = `rgba(${lineColor}, ${(1 - distance / LINK_DISTANCE) * 0.32})`;
            context.beginPath();
            context.moveTo(nodes[i].x, nodes[i].y);
            context.lineTo(nodes[j].x, nodes[j].y);
            context.stroke();
          }
        }
      }

      if (!reduced) {
        if (pulses.length < MAX_PULSES && Math.random() < 0.06) spawnPulse();
        pulses = pulses.filter((pulse) => {
          pulse.t += 0.018;
          const x = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.t;
          const y = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.t;
          const glow = context.createRadialGradient(x, y, 0, x, y, 7);
          glow.addColorStop(0, "rgba(94, 234, 212, 0.95)");
          glow.addColorStop(1, "rgba(94, 234, 212, 0)");
          context.fillStyle = glow;
          context.beginPath();
          context.arc(x, y, 7, 0, Math.PI * 2);
          context.fill();
          return pulse.t < 1;
        });
      }

      context.fillStyle = `rgba(${lineColor}, 0.85)`;
      for (const node of nodes) {
        context.beginPath();
        context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        context.fill();
      }
    }

    function loop() {
      draw();
      frame = visible ? requestAnimationFrame(loop) : 0;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    let observer;
    if (!reduced) {
      observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame) frame = requestAnimationFrame(loop);
      });
      observer.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer?.disconnect();
    };
  }, [density, tone]);

  return <canvas ref={canvasRef} className={`network-canvas ${className}`} aria-hidden="true" />;
}
