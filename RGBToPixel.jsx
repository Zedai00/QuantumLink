import React, { useState, useRef, useEffect } from 'react';

export default function RGBToPixel({ rgbArray }) {
  const canvasRef = useRef();
  const dividerRef = useRef();
  const inputRef = useRef();

  const [pixels, setPixels] = useState([]);
  const [pixelIndex, setPixelIndex] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [flyingCount, setFlyingCount] = useState(1);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);

  const cellSize = 2;
  const gridCols = Math.floor(300 / cellSize);
  const gridRows = Math.floor(300 / cellSize);

  useEffect(() => {
    if (rgbArray && rgbArray.length > 0) {
      setPixels(prev => [...prev, ...rgbArray]);
    }
  }, [rgbArray]);

  useEffect(() => {
    if (!paused && pixels.length > 0) animateNextPixels();
  }, [pixels, paused]);

  const animateNextPixels = () => {
    if (paused || pixels.length === 0) return;

    const batch = pixels.slice(0, flyingCount);
    setPixels(prev => prev.slice(flyingCount));

    batch.forEach((px, idx) => {
      dividerRef.current.classList.add('pulse');
      dividerRef.current.addEventListener('animationend', () => dividerRef.current.classList.remove('pulse'), { once: true });

      const flyingText = document.createElement('div');
      flyingText.className = 'outputBox';
      flyingText.innerText = `R=${px.r} | G=${px.g} | B=${px.b}`;
      document.body.appendChild(flyingText);

      const rectDivider = dividerRef.current.getBoundingClientRect();
      const targetX = 20, targetY = 115;
      const startX = 20, startY = 200;
      const dividerX = rectDivider.left + rectDivider.width / 2;
      const dividerY = rectDivider.top + rectDivider.height / 2;

      let progress = 0;
      const moveToDivider = () => {
        if (paused) return requestAnimationFrame(moveToDivider);
        progress += 0.02 * speed;
        if (progress >= 1) {
          flyingText.remove();
          spawnPixel(px);
          return;
        }
        flyingText.style.left = startX + (dividerX - startX) * progress + 'px';
        flyingText.style.top = startY + (dividerY - startY) * progress + 'px';
        requestAnimationFrame(moveToDivider);
      };

      const spawnPixel = (px) => {
        const flyingPixel = document.createElement('div');
        flyingPixel.className = 'flyingPixel';
        const rgb = `rgb(${px.r},${px.g},${px.b})`;
        flyingPixel.style.background = rgb;
        flyingPixel.style.boxShadow = `0 0 6px ${rgb},0 0 12px ${rgb}`;
        document.body.appendChild(flyingPixel);

        let p = 0;
        const moveToCanvas = () => {
          if (paused) return requestAnimationFrame(moveToCanvas);
          p += 0.02 * speed;
          if (p >= 1) {
            flyingPixel.remove();
            const col = pixelIndex % gridCols;
            const row = Math.floor(pixelIndex / gridCols);
            const ctx = canvasRef.current.getContext('2d');
            ctx.fillStyle = rgb;
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            setPixelIndex(prev => prev + 1);
            setGeneratedCount(prev => prev + 1);
            if (idx === batch.length - 1) animateNextPixels();
            return;
          }
          flyingPixel.style.left = dividerX + (targetX - dividerX) * p + 'px';
          flyingPixel.style.top = dividerY + (targetY - dividerY) * p + 'px';
          requestAnimationFrame(moveToCanvas);
        };
        moveToCanvas();
      };

      moveToDivider();
    });
  };

  return (
    <>
      <div ref={dividerRef} style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '240px', height: '100px', border: '2px solid #00f6ff', borderRadius: '14px',
        textAlign: 'center', lineHeight: '100px', fontSize: '24px', color: '#00f6ff',
        textShadow: '0 0 12px #00f6ff', boxShadow: '0 0 20px #00f6ff inset, 0 0 30px #00f6ff',
        background: 'rgba(15,23,42,1)', fontWeight: 'bold', zIndex: 10
      }}>RGB TO PIXEL</div>

      <canvas ref={canvasRef} width={300} height={300} style={{ position: 'absolute', right: '20px', top: '115px', border: '2px solid #00f6ff', borderRadius: '12px', boxShadow: '0 0 20px #00f6ff inset, 0 0 20px #00f6ff', background: '#000' }}></canvas>

      <div style={{ position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: '#00f6ff' }}>
        Speed: <input type="range" min="0.01" max="10" step="0.01" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} />
        <button onClick={() => setPaused(true)}>Pause</button>
        <button onClick={() => setPaused(false)}>Resume</button>
        <button onClick={() => setFlyingCount(prev => prev + 1)}>Add More Pixels</button>
      </div>

      <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '16px', fontWeight: 'bold', color: '#00f6ff' }}>Pixels Generated: {generatedCount}</div>

      <style>{`
        .flyingPixel { position:absolute; width:10px; height:10px; border-radius:3px; opacity:0.95; pointer-events:none; }
        .outputBox { position:absolute; padding:4px 6px; border:2px solid #00f6ff; border-radius:6px; font-size:14px; font-family:'Courier New', monospace; font-weight:bold; color:#00f6ff; background: rgba(15,23,42,1); text-align:center; white-space:nowrap; pointer-events:none; }
        .pulse { animation: pulseOnce 0.6s ease-out; }
        @keyframes pulseOnce { 0% { box-shadow:0 0 20px #00f6ff inset,0 0 30px #00f6ff;} 50% { box-shadow:0 0 60px #00f6ff inset,0 0 100px #00f6ff;} 100% { box-shadow:0 0 20px #00f6ff inset,0 0 30px #00f6ff;} }
      `}</style>
    </>
  );
}
