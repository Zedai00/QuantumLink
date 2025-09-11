import { createTimeline, svg, utils } from "animejs"
import React, { useContext, useEffect, useRef } from "react"
import { Context } from "../Context/Context"
import katex from "katex"
import "katex/dist/katex.min.css"

export default function Circuit() {
  const width = window.innerWidth
  const height = window.innerHeight

  const { stage, stagesData, onComplete, speed, animate } = useContext(Context)

  const input = stagesData[stage].input

  const root = useRef(null)
  const tlRef = useRef(null)

  function getSuperdenseOutputs(inputGate) {
    const outputs = [];
    outputs.push("|00\\rangle");
    outputs.push("\\frac{|00\\rangle + |10\\rangle}{\\sqrt{2}}");
    outputs.push("\\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}");
    switch (inputGate) {
      case "I": outputs.push("\\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}"); break;
      case "X": outputs.push("\\frac{|10\\rangle + |01\\rangle}{\\sqrt{2}}"); break;
      case "Z": outputs.push("\\frac{|00\\rangle - |11\\rangle}{\\sqrt{2}}"); break;
      case "XZ": outputs.push("\\frac{|10\\rangle - |01\\rangle}{\\sqrt{2}}"); break;
    }
    switch (inputGate) {
      case "I": outputs.push("\\frac{|00\\rangle + |10\\rangle}{\\sqrt{2}}"); break;
      case "X": outputs.push("\\frac{|11\\rangle + |01\\rangle}{\\sqrt{2}}"); break;
      case "Z": outputs.push("\\frac{|00\\rangle - |10\\rangle}{\\sqrt{2}}"); break;
      case "XZ": outputs.push("\\frac{|11\\rangle - |01\\rangle}{\\sqrt{2}}"); break;
    }
    switch (inputGate) {
      case "I": outputs.push("|00\\rangle"); break;
      case "X": outputs.push("|01\\rangle"); break;
      case "Z": outputs.push("|10\\rangle"); break;
      case "XZ": outputs.push("|11\\rangle"); break;
    }
    switch (inputGate) {
      case "I": outputs.push("00"); break;
      case "X": outputs.push("01"); break;
      case "Z": outputs.push("10"); break;
      case "XZ": outputs.push("11"); break;
    }
    return outputs;
  }

  useEffect(() => {
    const dynamicElements = [];
    const tl = createTimeline({ onComplete: () => onComplete() });
    tlRef.current = tl
    const outputBox = document.querySelector("#outp");

    input.forEach((gate, i) => {
      const qubitsData = [
        { id: `q1-${i}`, topPercent: 33.33 },
        { id: `q2-${i}`, topPercent: 50 }
      ];

      const qubits = qubitsData.map(({ id, topPercent }) => {
        const div = document.createElement("div");
        div.id = id;
        div.className = `opacity-0 absolute left-0 size-10 flex justify-center items-center
    bg-[#1f1f2e] text-[#00ffff] font-bold rounded-md shadow-[0_0_10px_#00ffff] border border-[#00ffff50]`;
        div.textContent = "|0>";

        // Append first to DOM so we can measure its height
        root.current.appendChild(div);

        // Dynamically center vertically based on its height
        const divHeight = div.offsetHeight;
        div.style.top = `calc(${topPercent}% - ${divHeight / 2}px)`;

        dynamicElements.push(div);
        return div;
      });

      const [q1, q2] = qubits;

      const gateDiv = document.createElement("div");
      gateDiv.textContent = gate;
      gateDiv.className = ` absolute top-0 left-0 size-15 z-0 rounded-md bg-[#7f00ff] text-white flex justify-center items-center 
        shadow-[0_0_12px_#7f00ff] border border-[#ff77ff50]`;
      root.current.prepend(gateDiv);
      dynamicElements.push(gateDiv);

      const alicePaths = ["alice1", "alice2", "alice3", "alice4", "alice5", "alice6", "alice7"];
      const bobPaths = ["bob1", "bob2", "bob3", "bob4", "bob5", "bob6", "bob7"];
      const baseDuration = 5000;

      const outputs = getSuperdenseOutputs(gate);

      outputBox.innerHTML = katex.renderToString(outputs[0], {
        throwOnError: false,
        displayMode: true
      });

      const aliceMotions = alicePaths.map(id => svg.createMotionPath(`#${id}`));
      const bobMotions = bobPaths.map(id => svg.createMotionPath(`#${id}`));
      const { translateX: inpX, translateY: inpY } = svg.createMotionPath("#inp");
      const aliceLengths = alicePaths.map(id => document.querySelector(`#${id}`).getTotalLength());
      const totalLength = aliceLengths.reduce((a, b) => a + b, 0);

      alicePaths.forEach((_, idx) => {
        const duration = baseDuration * (aliceLengths[idx] / totalLength);

        tl.add(q1, {
          translateX: aliceMotions[idx].translateX,
          translateY: aliceMotions[idx].translateY,
          opacity: 1,
          duration,
          onComplete: () => {
            outputBox.innerHTML = katex.renderToString(outputs[idx + 1], {
              throwOnError: false,
              displayMode: true
            });
          }
        });

        tl.add(q2, {
          translateX: bobMotions[idx].translateX,
          translateY: bobMotions[idx].translateY,
          opacity: 1,
          duration
        }, `-=${duration}`);

        if (idx === 2) {
          tl.add(gateDiv, {
            translateX: inpX,
            translateY: inpY,
            duration: 800,
            onComplete: () => gateDiv.remove()
          }, "-=500");
        }

        if (idx === alicePaths.length - 1) {
          tl.add({}, {
            duration: 0,
            onComplete: () => {
              qubits.forEach(q => q.remove());
            }
          });
        }

      });

    });

    return () => {
      dynamicElements.forEach(el => el.remove());
      tl.cancel()
    };
  }, [input]);

  useEffect(() => {
    if (tlRef) {
      animate ? utils.sync(() => tlRef.current.play()) : utils.sync(() => tlRef.current.pause())
    }
  }, [animate])

  useEffect(() => {
    if (tlRef.current) utils.sync(() => (tlRef.current.speed = speed));
  }, [speed]);


  return (
    <div ref={root} className="bg-[#0a0a1a] w-full h-full relative">
      {/* Alice paths */}
      <div className="absolute left-0 top-1/3">
        <svg width={width} height="600" viewBox={`0 0 ${width} 600`}>
          <path id="alice1" d={`M 0 0 l ${width * 0.15} 0`} fill="none" stroke="#00ffff" strokeWidth="2" />
          <path id="alice2" d={`M ${width * 0.15} 0 l ${width * 0.15} 0`} fill="none" stroke="#00ffff" strokeWidth="2" />
          <path id="alice3" d={`M ${width * 0.31} 0 l ${width * 0.17} 0`} fill="none" stroke="#00ffff" strokeWidth="2" />
          <path id="alice4" d={`M ${width * 0.48} 0 l ${width * 0.15} 0`} fill="none" stroke="#00ffff" strokeWidth="2" />
          <path id="alice5" d={`M ${width * 0.6} 0 l ${width * 0.15} 0`} fill="none" stroke="#00ffff" strokeWidth="2" />
          <path id="alice6" d={`M ${width * 0.75} 0 l ${width * 0.15} 0`} fill="none" stroke="#00ffff" strokeWidth="2" />
          <path id="alice7" d={`M ${width * 0.9} 0 l ${width * 0.15} 0`} fill="none" stroke="#00ffff" strokeWidth="2" />
        </svg>
      </div>

      {/* Bob paths */}
      <div className="absolute left-0 top-1/2">
        <svg width={width} height="600" viewBox={`0 0 ${width} 600`}>
          <path id="bob1" d={`M 0 0 l ${width * 0.15} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
          <path id="bob2" d={`M ${width * 0.15} 0 l ${width * 0.15} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
          <path id="bob3" d={`M ${width * 0.31} 0 l ${width * 0.17} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
          <path id="bob4" d={`M ${width * 0.48} 0 l ${width * 0.15} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
          <path id="bob5" d={`M ${width * 0.6} 0 l ${width * 0.15} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
          <path id="bob6" d={`M ${width * 0.75} 0 l ${width * 0.15} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
          <path id="bob7" d={`M ${width * 0.9} 0 l ${width * 0.15} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
        </svg>
      </div>

      <div id="outp" className="absolute top-[60%] left-146 bg-[#1f1f2e] text-[#00ffff] rounded-md shadow-[0_0_12px_#00ffff] flex justify-center items-center text-xl font-bold size-40"></div>

      {/* Input path visible */}
      <div className="absolute left-1/2 top-0">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <path id="inp" d={`M ${width / 2 - 50} 0 l 0 ${height / 3}`} fill="none" stroke="none" strokeWidth="2" />
        </svg>5
      </div>

      {/* Gate boxes */}
      <div className="absolute top-[calc(33.33%-1.8rem)] left-50 size-15 z-1 flex justify-center items-center bg-[#7f00ff] text-white rounded-md shadow-[0_0_10px_#7f00ff]">H</div>
      <div className="absolute top-[calc(33.33%-1.8rem)] z-1 left-100 size-15 flex justify-center items-center bg-[#00ffff] text-black rounded-md shadow-[0_0_10px_#00ffff]">C</div>
      <div className="absolute top-[calc(33.33%)] left-107 w-1 z-0 size-10 bg-[#00ffff] h-27 shadow-[0_0_6px_#00ffff]"></div>
      <div className="absolute top-[calc(50%-1.8rem)] z-1 left-100 size-15 flex justify-center items-center bg-[#7f00ff] text-white rounded-[50%] shadow-[0_0_10px_#7f00ff]">X</div>
      <div className="absolute top-[calc(24%)]  left-150 size-30 z-1 flex justify-center items-center bg-[#1f1f2e] text-[#00ffff] rounded-lg shadow-[0_0_12px_#00ffff]">Gate Apply</div>
      <div className="absolute top-[calc(33.33%-1.8rem)] z-1 left-210 size-15 flex justify-center items-center bg-[#00ffff] text-black rounded-md shadow-[0_0_10px_#00ffff]">C</div>
      <div className="absolute top-[calc(33.33%)] left-217 w-1 z-0 size-10 bg-[#00ffff] h-27 shadow-[0_0_6px_#00ffff]"></div>
      <div className="absolute top-[calc(50%-1.8rem)] z-1 left-210 size-15 flex justify-center items-center bg-[#7f00ff] text-white rounded-[50%] shadow-[0_0_10px_#7f00ff]">X</div>
      <div className="absolute top-[calc(33.33%-1.8rem)] left-252 z-1 size-15 flex justify-center items-center bg-[#ffaa00] text-black rounded-md shadow-[0_0_10px_#ffaa00]">H</div>
      <div className="absolute top-[calc(33.33%-1.8rem)] z-1 left-305 size-15 flex justify-center items-center bg-[#00ff85] text-black rounded-md shadow-[0_0_10px_#00ff85]">O</div>
      <div className="absolute top-[calc(50%-1.2rem)] z-1 left-305 size-15 flex justify-center items-center bg-[#00ff85] text-black rounded-md shadow-[0_0_10px_#00ff85]">O</div>

      <div className="absolute bg-[#0a0a1a] size-20 top-0 left-0 z-10"></div>
    </div>
  )
}

