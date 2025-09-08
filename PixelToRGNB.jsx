import React, { useRef, useState, useEffect } from "react";

// PixelToRGNB.jsx
// React conversion of your first HTML file (Pixel to RGB One-by-Many with Counter)
// Exports a single component that accepts an optional callback `onCollectedRGBs(rgbArray)`
// which receives an array of {r,g,b,a,x,y} objects as they are released.

export default function PixelToRGNB({ onCollectedRGBs }) {
  const canvasRef = useRef(null);
  const dividerRef = useRef(null);
  const [pixels, setPixels] = useState([]);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [releasedCount, setReleasedCount] = useState(0);
  const [flyingCount, setFlyingCount] = useState(1);
  const animatingRef = useRef(false);
  const collectedRef = useRef([]); // store released pixels to pass upstream

  // Style injection: replicate neon cyberpunk look from original pages
  const styles = `
  .pt-wrapper{margin:0;background:#0b1220;font-family: 'Courier New', monospace;color:#00f6ff;overflow:hidden;height:100vh;}
  .uploadBox{position:absolute;top:14px;width:100%;text-align:center;z-index:20}
  .panelBox{width:320px;height:320px;border:2px solid #00f6ff;border-radius:12px;box-shadow:0 0 25px #00f6ff inset,0 0 25px #00f6ff;background:rgba(10,15,30,0.9);display:flex;justify-content:center;align-items:center;overflow:hidden;position:absolute;left:20px;top:50px}
  canvas{max-width:100%;max-height:100%;}
  #pixelDivider{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:240px;height:100px;border:2px solid #00f6ff;border-radius:14px;text-align:center;line-height:100px;font-size:24px;color:#00f6ff;text-shadow:0 0 12px #00f6ff;box-shadow:0 0 20px #00f6ff inset,0 0 30px #00f6ff;background:rgba(15,23,42,1);font-weight:bold;z-index:10}
  .pulse{animation:pulseOnce 0.6s ease-out}
  @keyframes pulseOnce{0%{box-shadow:0 0 20px #00f6ff inset,0 0 30px #00f6ff}50%{box-shadow:0 0 60px #00f6ff inset,0 0 100px #00f6ff}100%{box-shadow:0 0 20px #00f6ff inset,0 0 30px #00f6ff}}
  .flyingPixel{position:absolute;width:10px;height:10px;border-radius:50%;opacity:0.95;pointer-events:none}
  .outputBox{position:absolute;padding:4px 6px;border:2px solid #00f6ff;border-radius:6px;font-size:16px;font-family:'Courier New',monospace;font-weight:bold;color:#00f6ff;background:rgba(15,23,42,1);text-align:center;white-space:nowrap;pointer-events:none}
  .controls{position:absolute;bottom:50px;left:50%;transform:translateX(-50%);text-align:center;color:#00f6ff}
  .controls input[type=range]{width:300px}
  .controls button{background:#0b1220;border:2px solid #00f6ff;color:#00f6ff;padding:6px 14px;border-radius:8px;cursor:pointer;margin-left:10px;box-shadow:0 0 8px #00f6ff}
  .controls button:hover{background:#112233}
  .pixelCounter{position:absolute;top:20px;right:20px;font-size:16px;font-weight:bold;color:#00f6ff}
  `;

  // Helper to create DOM flying elements (we use direct DOM manipulation because
  // animation is transient and heavy to manage via React tree)
  function createFlyingElement(className, styles = {}) {
    const el = document.createElement("div");
    el.className = className;
    Object.assign(el.style, styles);
    document.body.appendChild(el);
    return el;
  }

  // Handle file upload
  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const maxSize = 300;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      const w = Math.max(1, Math.floor(img.width * scale));
      const h = Math.max(1, Math.floor(img.height * scale));
      const canvas = canvasRef.current;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const arr = [];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          arr.push({ r: imgData.data[i], g: imgData.data[i + 1], b: imgData.data[i + 2], a: imgData.data[i + 3], x, y });
        }
      }
      setPixels(arr);
      // Start animation if not running
      if (!animatingRef.current) animateNextPixels(arr.slice(), true);
    };
    img.src = URL.createObjectURL(file);
  }

  useEffect(() => {
    // cleanup on unmount: remove any flying transient elements
    return () => {
      document.querySelectorAll(".flyingPixel, .outputBox").forEach(n => n.remove());
    };
  }, []);

  function animateNextPixels(queue = null, fromUpload = false) {
    // If caller didn't supply queue, use current pixels
    let localQueue = Array.isArray(queue) ? queue : pixels.slice();
    if (!localQueue || localQueue.length === 0) {
      animatingRef.current = false;
      return;
    }
    animatingRef.current = true;

    const batch = localQueue.splice(0, flyingCount);

    // Update pixels state to reflect removed items
    if (fromUpload) {
      // first call had full array, set state to remainder
      setPixels(localQueue);
    } else {
      setPixels(prev => prev.slice(flyingCount));
    }

    batch.forEach((pixel, idx) => {
      // Clear 1px from canvas to show "removed" pixel
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(pixel.x, pixel.y, 1, 1);

      // pulse divider
      const divider = dividerRef.current;
      divider.classList.add("pulse");
      setTimeout(() => divider.classList.remove("pulse"), 200);

      // create flying pixel
      const rgba = `rgba(${pixel.r},${pixel.g},${pixel.b},${pixel.a / 255})`;
      const flying = createFlyingElement("flyingPixel", { background: rgba, boxShadow: `0 0 6px ${rgba},0 0 12px ${rgba}`, width: "10px", height: "10px" });

      // compute start & target positions
      const rectOriginal = canvasRef.current.getBoundingClientRect();
      const rectDivider = divider.getBoundingClientRect();
      const startX = rectOriginal.left + pixel.x;
      const startY = rectOriginal.top + pixel.y;
      const dividerX = rectDivider.left + rectDivider.width / 2;
      const dividerY = rectDivider.top + rectDivider.height / 2;
      const targetX = window.innerWidth - 200; // keep simple

      let progress = 0;
      function moveToDivider() {
        if (paused) {
          requestAnimationFrame(moveToDivider);
          return;
        }
        progress += 0.02 * speed;
        if (progress >= 1) {
          progress = 0;
          flying.remove();
          showOutputAndMove(pixel, dividerX, dividerY, targetX, batch, pixel === batch[batch.length - 1]);
          return;
        }
        flying.style.left = startX + (dividerX - startX) * progress + "px";
        flying.style.top = startY + (dividerY - startY) * progress + "px";
        flying.style.transform = `scale(${1 + progress * 0.5})`;
        requestAnimationFrame(moveToDivider);
      }
      moveToDivider();
    });

    // continue animating if there are still queued pixels
    if (localQueue.length > 0) {
      // Use timeout to let this batch start first, or rely on callbacks of last pixel
      // But we will rely on last pixel's continuation inside showOutputAndMove
    } else {
      // nothing left in queue for now
    }
  }

  function showOutputAndMove(pixel, dividerX, dividerY, targetX, batch, isLastOfBatch) {
    // create output box
    const output = createFlyingElement("outputBox", { left: dividerX + "px", top: dividerY + "px" });
    output.innerText = `R=${pixel.r} | G=${pixel.g} | B=${pixel.b}`;

    let finalProgress = 0;
    function moveOut() {
      if (paused) {
        requestAnimationFrame(moveOut);
        return;
      }
      finalProgress += 0.01 * speed;
      if (finalProgress >= 1) {
        output.remove();
        // update counters & collected list
        setReleasedCount(c => c + 1);
        collectedRef.current.push({ r: pixel.r, g: pixel.g, b: pixel.b, a: pixel.a });
        if (onCollectedRGBs) onCollectedRGBs(collectedRef.current.slice());

        // if this pixel was the last in its batch, attempt to run next batch
        if (isLastOfBatch) {
          // if there are more pixels in state, continue
          if (pixels.length > 0) {
            animateNextPixels();
          } else {
            animatingRef.current = false;
          }
        }
        return;
      }
      output.style.left = dividerX + (targetX - dividerX) * finalProgress + "px";
      requestAnimationFrame(moveOut);
    }
    moveOut();
  }

  return (
    <div className="pt-wrapper">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="uploadBox">
        <input type="file" accept="image/*" onChange={handleFile} />
      </div>

      <div className="panelBox">
        <canvas ref={canvasRef} />
      </div>

      <div id="pixelDivider" ref={dividerRef}>PIXEL TO RGB</div>

      <div className="controls">
        Speed: <input type="range" min="0.01" max="10" step="0.01" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} />
        <button onClick={() => setPaused(true)}>Pause</button>
        <button onClick={() => { setPaused(false); if (!animatingRef.current && pixels.length > 0) animateNextPixels(); }}>Resume</button>
        <button onClick={() => setFlyingCount(c => c + 1)}>Add More Pixels</button>
      </div>

      <div className="pixelCounter">Pixels Released: {releasedCount}</div>
    </div>
  );
}
