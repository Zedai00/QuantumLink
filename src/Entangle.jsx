import React, { useEffect, useRef } from "react";
import "./Entangle.css";

export default function Entangle() {
  const canvasRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width,
      H = canvas.height;
    const R = 110;
    const leftCx = W * 0.25;
    const rightCx = W * 0.75;
    const cy = H / 2;

    let bitTarget = 1;
    let phaseTarget = 1;
    let bitLength = 1;
    let phaseLength = 1;
    let animating = false;
    let sphereColor = "#ffffff";
    let wavePhase = 0;

    const gateColors = {
      I: "#9aa0a6",
      X: "#ff9800",
      Z: "#00e5ff",
      XZ: "#ba68c8",
    };

    function drawSphere(cx, cy, label) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = sphereColor;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#eef6ff";
      ctx.font = "20px Inter, Arial";
      ctx.fillText(label, cx - 18, cy - R - 12);

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(200,80,80,0.14)";
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.stroke();

      ctx.strokeStyle = "rgba(80,200,140,0.10)";
      ctx.beginPath();
      ctx.moveTo(cx, cy - R);
      ctx.lineTo(cx, cy + R);
      ctx.stroke();

      const bx = cx;
      const by = cy - bitTarget * R * 0.78 * bitLength;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      const px = cx + phaseTarget * R * 0.78 * phaseLength;
      const py = cy;
      ctx.strokeStyle = "#6ef0ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#6ef0ff";
      ctx.fill();
      ctx.lineWidth = 1;
    }

    function drawLink() {
      ctx.lineWidth = 3;
      const grad = ctx.createLinearGradient(leftCx + R, cy, rightCx - R, cy);
      grad.addColorStop(0, sphereColor);
      grad.addColorStop(0.5, "#6ef0ff");
      grad.addColorStop(1, sphereColor);
      ctx.strokeStyle = grad;

      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = leftCx + R + t * ((rightCx - R) - (leftCx + R));
        const y = cy + Math.sin(t * 12 * Math.PI + wavePhase) * 12;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    function clear() {
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(
        W / 2 - 120,
        H / 2 - 80,
        20,
        W / 2,
        H / 2,
        R * 3.0
      );
      g.addColorStop(0, "rgba(100,140,180,0.02)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    function drawAll() {
      clear();
      drawSphere(leftCx, cy, "Alice");
      drawSphere(rightCx, cy, "Bob");
      drawLink();
    }

    function animateFlip(flipBit, flipPhase, color) {
      if (animating) return;
      animating = true;
      sphereColor = color || "#ffffff";

      let progress = 0;
      const speedShrink = 0.06;
      const speedGrow = 0.06;
      let shrinking = true;

      function step() {
        wavePhase += 1;

        if (shrinking) {
          progress += speedShrink;
          bitLength = flipBit ? Math.max(0, 1 - progress) : 1;
          phaseLength = flipPhase ? Math.max(0, 1 - progress) : 1;

          if (progress >= 1.0) {
            if (flipBit) bitTarget *= -1;
            if (flipPhase) phaseTarget *= -1;
            shrinking = false;
            progress = 0;
          }
        } else {
          progress += speedGrow;
          bitLength = flipBit ? Math.min(1, progress) : 1;
          phaseLength = flipPhase ? Math.min(1, progress) : 1;

          if (progress >= 1.0) {
            animating = false;
            setTimeout(() => {
              sphereColor = "#ffffff";
            }, 80);
            drawAll();
            return;
          }
        }

        drawAll();
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function applyGate(g) {
      if (animating) return;
      const pop = popupRef.current;

      if (g === "I") {
        sphereColor = gateColors.I;
        pop.textContent = "Output: I";
        setTimeout(() => {
          sphereColor = "#ffffff";
          pop.textContent = "";
        }, 600);
        return;
      }

      if (g === "X") {
        animateFlip(true, false, gateColors.X);
        pop.textContent = "Output: X";
      } else if (g === "Z") {
        animateFlip(false, true, gateColors.Z);
        pop.textContent = "Output: Z";
      } else if (g === "XZ") {
        animateFlip(true, true, gateColors.XZ);
        pop.textContent = "Output: XZ";
      }

      setTimeout(() => {
        if (!animating) popupRef.current.textContent = "";
      }, 900);
    }

    function idleLoop() {
      if (!animating) {
        wavePhase += 0.045;
        drawAll();
      }
      requestAnimationFrame(idleLoop);
    }

    // attach buttons
    const btns = {
      I: document.getElementById("btnI"),
      X: document.getElementById("btnX"),
      Z: document.getElementById("btnZ"),
      XZ: document.getElementById("btnXZ"),
    };

    btns.I.addEventListener("click", () => applyGate("I"));
    btns.X.addEventListener("click", () => applyGate("X"));
    btns.Z.addEventListener("click", () => applyGate("Z"));
    btns.XZ.addEventListener("click", () => applyGate("XZ"));

    ctx.font = "14px Inter, Arial";
    drawAll();
    idleLoop();
  }, []);

  return (
    <div>
      <h2>Information_Transfer</h2>
      <div id="wrap">
        <div className="controls">
          <button id="btnI">I</button>
          <button id="btnX">X</button>
          <button id="btnZ">Z</button>
          <button id="btnXZ">XZ</button>
        </div>

        <canvas ref={canvasRef} id="c" width="880" height="420"></canvas>

        <div id="popup" ref={popupRef}></div>
      </div>
    </div>
  );
}
