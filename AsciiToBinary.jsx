import React, { useState, useRef, useEffect } from 'react';

export default function AsciiToBinary({ rgbArray, onConverted }) {
  const dividerRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  const to8bit = (val) => val.toString(2).padStart(8, '0');

  useEffect(() => {
    if (rgbArray && rgbArray.length && currentIndex < rgbArray.length) {
      animateNext(rgbArray[currentIndex], currentIndex);
    }
  }, [currentIndex, rgbArray]);

  const animateNext = (pixel, idx) => {
    if (paused) return;

    const rectDivider = dividerRef.current.getBoundingClientRect();
    const startX = -200;
    const startY = rectDivider.top + rectDivider.height / 2 - 20;
    const dividerX = rectDivider.left + rectDivider.width / 2 - 100;
    const dividerY = rectDivider.top + rectDivider.height / 2;

    const inputBox = document.createElement('div');
    inputBox.className = 'flyingBox';
    inputBox.innerText = `R=${pixel.r} | G=${pixel.g} | B=${pixel.b}`;
    document.body.appendChild(inputBox);

    let progress = 0;
    const moveToDivider = () => {
      if (paused) { requestAnimationFrame(moveToDivider); return; }
      progress += 0.015 * speed;
      if (progress >= 1) {
        dividerRef.current.classList.add('pulse');
        setTimeout(() => dividerRef.current.classList.remove('pulse'), 200);
        inputBox.remove();
        showBinaryBoxes(pixel);
        return;
      }
      inputBox.style.left = startX + (dividerX - startX) * progress + 'px';
      inputBox.style.top = startY + 'px';
      requestAnimationFrame(moveToDivider);
    };
    moveToDivider();
  };

  const showBinaryBoxes = (pixel) => {
    const binaries = [to8bit(pixel.r), to8bit(pixel.g), to8bit(pixel.b)];
    binaries.forEach((text, idx) => {
      setTimeout(() => {
        const box = document.createElement('div');
        box.className = 'flyingBox';
        box.innerText = text;
        document.body.appendChild(box);

        let progress = 0;
        const animate = () => {
          progress += 0.01 * speed;
          if (progress >= 1) {
            box.remove();
            if (idx === binaries.length - 1) {
              onConverted && onConverted({ rBin: to8bit(pixel.r), gBin: to8bit(pixel.g), bBin: to8bit(pixel.b) });
              setCurrentIndex(prev => prev + 1);
            }
            return;
          }
          box.style.left = (dividerRef.current.getBoundingClientRect().left + dividerRef.current.offsetWidth / 2) + (window.innerWidth - 100) * progress + 'px';
          box.style.top = dividerRef.current.getBoundingClientRect().top + dividerRef.current.offsetHeight / 2 + 'px';
          requestAnimationFrame(animate);
        };
        animate();
      }, idx * 600);
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
        textAlign: 'center', lineHeight: '100px', fontSize: '24px', color: '#00f6ff',
        textShadow: '0 0 12px #00f6ff', boxShadow: '0 0 20px #00f6ff inset, 0 0 30px #00f6ff',
        background: 'rgba(15,23,42,1)', fontWeight: 'bold', zIndex: 10
      }}>ASCII TO BINARY</div>
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
