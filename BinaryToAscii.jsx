import React, { useState, useRef, useEffect } from 'react';

export default function BinaryToAscii({ binaryArray, onConverted }) {
  const dividerRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  const binToDec = (bin) => parseInt(bin, 2);

  useEffect(() => {
    if (binaryArray && binaryArray.length && currentIndex < binaryArray.length) {
      animateNext(binaryArray[currentIndex], currentIndex);
    }
  }, [currentIndex, binaryArray]);

  const animateNext = (binaryObj, idx) => {
    if (paused) return;
    const { rBin, gBin, bBin } = binaryObj;
    const binaries = [rBin, gBin, bBin];

    const rectDivider = dividerRef.current.getBoundingClientRect();
    const dividerX = rectDivider.left + rectDivider.width / 2;
    const dividerY = rectDivider.top + rectDivider.height / 2;

    binaries.forEach((text, bIdx) => {
      setTimeout(() => {
        const box = document.createElement('div');
        box.className = 'flyingBox';
        box.innerText = text;
        document.body.appendChild(box);

        let progress = 0;
        const animate = () => {
          progress += 0.015 * speed;
          if (progress >= 1) {
            box.remove();
            if (bIdx === binaries.length - 1) {
              // After last binary, send decimal RGB to next component
              const r = binToDec(rBin);
              const g = binToDec(gBin);
              const b = binToDec(bBin);
              onConverted && onConverted({ r, g, b });
              setCurrentIndex(prev => prev + 1);
            }
            return;
          }
          const startX = -200;
          box.style.left = startX + (dividerX - startX) * progress + 'px';
          box.style.top = dividerY + 'px';
          requestAnimationFrame(animate);
        };
        animate();
      }, bIdx * 700);
    });
  };

  return (
    <>
      <div style={{ position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: '#00f6ff' }}>
        Speed: <input type="range" min="0.01" max="10" step="0.01" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} />
        <button onClick={() => setPaused(true)}>Pause</button>
        <button onClick={() => setPaused(false)}>Resume</button>
      </div>
      <div ref={dividerRef} style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '280px', height: '100px', border: '2px solid #00f6ff', borderRadius: '14px',
        textAlign: 'center', lineHeight: '100px', fontSize: '22px', color: '#00f6ff',
        textShadow: '0 0 12px #00f6ff', boxShadow: '0 0 20px #00f6ff inset, 0 0 30px #00f6ff',
        background: 'rgba(15,23,42,1)', fontWeight: 'bold', zIndex: 10
      }}>BINARY TO ASCII</div>
      <style>{`
        .flyingBox { position: absolute; padding: 4px 10px; border: 2px solid #00f6ff; border-radius: 6px;
        font-size: 16px; font-family: 'Courier New', monospace; font-weight: bold;
        color: #00f6ff; background: rgba(15,23,42,1); white-space: nowrap; box-shadow: 0 0 12px #00f6ff;
        pointer-events: none; }
        .pulse { animation: pulseOnce 0.6s ease-out; }
        @keyframes pulseOnce { 0% { box-shadow:0 0 20px #00f6ff inset,0 0 30px #00f6ff;} 50% { box-shadow:0 0 60px #00f6ff inset,0 0 100px #00f6ff;} 100% { box-shadow:0 0 20px #00f6ff inset,0 0 30px #00f6ff;} }
      `}</style>
    </>
  );
}
