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

  const CNOT_LaTeX =
    "\\text{CNOT: } |0\\rangle|b\\rangle \\to |0\\rangle|b\\rangle, \\quad |1\\rangle|b\\rangle \\to |1\\rangle|b \\oplus 1\\rangle";

  const H_2x2_LaTeX =
    "\\begin{bmatrix}\\tfrac{1}{\\sqrt{2}} & \\tfrac{1}{\\sqrt{2}} \\\\ \\tfrac{1}{\\sqrt{2}} & -\\tfrac{1}{\\sqrt{2}}\\end{bmatrix}";

  // produce derivations with explicit matrix multiplication for each encoding
  function getSuperdenseOutputs(inputGate) {
    // reusable pieces
    const initial =
      "\\textbf{Step 0: Initial} \\\\[1em] " +
      "|0\\rangle = \\begin{bmatrix}1\\\\0\\end{bmatrix}, \\quad " +
      "|0\\rangle = \\begin{bmatrix}1\\\\0\\end{bmatrix} \\ " +
      "\\Rightarrow |0\\rangle_A |0\\rangle_B = |0\\rangle \\otimes |0\\rangle \\ " +
      "= \\begin{bmatrix}1\\\\0\\end{bmatrix} \\otimes \\begin{bmatrix}1\\\\0\\end{bmatrix} = |00\\rangle = |\\Psi{0}\\rangle"

    const hadamard = `
\\textbf{Step 1: Alice applies  H on }|\\Psi{0}\\rangle \\\\[1em]

\\begin{alignedat}{2}
& H = ${H_2x2_LaTeX} 
&\\quad &\\begin{aligned}
H|\\Psi{1}\\rangle = H|00\\rangle &= H|0\\rangle \\otimes |0\\rangle = (H|0\\rangle) \\otimes |0\\rangle \\\\
&= (\\tfrac{1}{\\sqrt{2}}(|0\\rangle+|1\\rangle)) \\otimes |0\\rangle \\\\
&= \\tfrac{1}{\\sqrt{2}}(|0\\rangle\\otimes|0\\rangle + |1\\rangle\\otimes|0\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(|00\\rangle + |10\\rangle) = |\\Psi{1}\\rangle
\\end{aligned}
\\end{alignedat}
`;

    const bell =
      "\\textbf{Step 2: Alice applies CNOT on } \\Psi{1} \\\\[1em]" +
      CNOT_LaTeX + " \\\\[0.75em]" +
      "\\Psi{2} \\Rightarrow \\tfrac{1}{\\sqrt{2}}(|00\\rangle + |10\\rangle) \\xrightarrow{\\text{CNOT}} " +
      "\\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle) = \\Psi{2} ";


    const derivs = []

    // base steps
    derivs.push(initial)
    derivs.push(hadamard)
    derivs.push(bell)

    // then per inputGate show explicit arithmetic
    switch (inputGate) {
      case "I": {
        const I_gate_step = `
\\textbf{Step 3: Alice applies I on }|\\Psi_2\\rangle \\\\[1em]

\\begin{alignedat}{2}
& I = \\begin{bmatrix}1 & 0 \\\\ 0 & 1\\end{bmatrix} 
&\\quad &\\begin{aligned}
I|\\Psi_2\\rangle &= I\\left(\\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)\\right) \\\\
&= \\tfrac{1}{\\sqrt{2}}(I|0\\rangle \\otimes |0\\rangle + I|1\\rangle \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(|0\\rangle \\otimes |0\\rangle + |1\\rangle \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle) = |\\Psi_3\\rangle
\\end{aligned}
\\end{alignedat}
`;
        const cnot =
          "\\textbf{Step 4: Bob applies CNOT on } \\Psi{3} \\\\[1em]" +
          CNOT_LaTeX + " \\\\[0.75em]" +
          "\\Psi{3} \\Rightarrow \\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle) \\xrightarrow{\\text{CNOT}} " +
          "\\tfrac{1}{\\sqrt{2}}(|00\\rangle + |10\\rangle) = \\Psi{4} ";


        const h_bob = `
\\textbf{Step 3: Bob applies H on }|\\Psi_4\\rangle \\\\[1em]

\\begin{alignedat}{2}
& H = ${H_2x2_LaTeX}
&\\quad &\\begin{aligned}
H|\\Psi_4\\rangle &= H\\left(\\tfrac{1}{\\sqrt{2}}(|00\\rangle + |10\\rangle)\\right) \\
= \\tfrac{1}{\\sqrt{2}}(H|0\\rangle \\otimes |0\\rangle + H|1\\rangle \\otimes |0\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(\\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |0\\rangle + (\\tfrac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle) \\otimes |0\\rangle) \\\\
&= \\tfrac{1}{2}(|00\\rangle + |10\\rangle + |00\\rangle - |10\\rangle) \\
= |00\\rangle =  |\\Psi_5\\rangle
\\end{aligned}
\\end{alignedat}
`;

        const result = "\\textbf{Step 4: Bob Measures } \\Psi_5 \\\\[1em] |\\Psi_5\\rangle = |00\\rangle \\xrightarrow{\\text{Measurement}} 00 "

        derivs.push(I_gate_step)
        derivs.push(cnot)
        derivs.push(h_bob)
        derivs.push(result)
        break
      }

      case "X": {
        const X_gate_step = `
\\textbf{Step 3: Alice applies X on }|\\Psi_2\\rangle \\\\[1em]

\\begin{alignedat}{2}
& X = \\begin{bmatrix}0 & 1 \\\\ 1 & 0\\end{bmatrix} 
&\\quad &\\begin{aligned}
X|\\Psi_2\\rangle &= X\\left(\\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)\\right) \\\\
&= \\tfrac{1}{\\sqrt{2}}(X|0\\rangle \\otimes |0\\rangle + X|1\\rangle \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(|1\\rangle \\otimes |0\\rangle + |0\\rangle \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(|10\\rangle + |01\\rangle) = |\\Psi_3\\rangle
\\end{aligned}
\\end{alignedat}
`;
        const cnot =
          "\\textbf{Step 4: Bob applies CNOT on } \\Psi{3} \\\\[1em]" +
          CNOT_LaTeX + " \\\\[0.75em]" +
          "\\Psi{3} \\Rightarrow \\tfrac{1}{\\sqrt{2}}(|10\\rangle + |01\\rangle) \\xrightarrow{\\text{CNOT}} " +
          "\\tfrac{1}{\\sqrt{2}}(|11\\rangle + |01\\rangle) = \\Psi{4} ";


        const h_bob = `
\\textbf{Step 3: Bob applies H on }|\\Psi_4\\rangle \\\\[1em]

\\begin{alignedat}{2}
& H = ${H_2x2_LaTeX}
&\\quad &\\begin{aligned}
H|\\Psi_4\\rangle &= H\\left(\\tfrac{1}{\\sqrt{2}}(|11\\rangle + |01\\rangle)\\right) \\
= \\tfrac{1}{\\sqrt{2}}(H|1\\rangle \\otimes |1\\rangle + H|0\\rangle \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(\\tfrac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle) \\otimes |1\\rangle + (\\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{2}(|01\\rangle - |11\\rangle + |01\\rangle + |11\\rangle) \\
= |01\\rangle =  |\\Psi_5\\rangle
\\end{aligned}
\\end{alignedat}
`;

        const result = "\\textbf{Step 4: Bob Measures } \\Psi_5 \\\\[1em] |\\Psi_5\\rangle = |01\\rangle \\xrightarrow{\\text{Measurement}} 01 "

        derivs.push(X_gate_step)
        derivs.push(cnot)
        derivs.push(h_bob)
        derivs.push(result)
        break
      }

      case "Z": {
        const Z_gate_step = `
\\textbf{Step 3: Alice applies Z on }|\\Psi_2\\rangle \\\\[1em]

\\begin{alignedat}{2}
& Z = \\begin{bmatrix}1 & 0 \\\\ 0 & -1\\end{bmatrix} 
&\\quad &\\begin{aligned}
Z|\\Psi_2\\rangle &= Z\\left(\\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)\\right) \\\\
&= \\tfrac{1}{\\sqrt{2}}(Z|0\\rangle \\otimes |0\\rangle + Z|1\\rangle \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(|0\\rangle \\otimes |0\\rangle - |1\\rangle \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(|00\\rangle - |11\\rangle) = |\\Psi_3\\rangle
\\end{aligned}
\\end{alignedat}
`;
        const cnot =
          "\\textbf{Step 4: Bob applies CNOT on } \\Psi{3} \\\\[1em]" +
          CNOT_LaTeX + " \\\\[0.75em]" +
          "\\Psi{3} \\Rightarrow \\tfrac{1}{\\sqrt{2}}(|00\\rangle - |11\\rangle) \\xrightarrow{\\text{CNOT}} " +
          "\\tfrac{1}{\\sqrt{2}}(|00\\rangle - |10\\rangle) = \\Psi{4} ";


        const h_bob = `
\\textbf{Step 3: Bob applies H on }|\\Psi_4\\rangle \\\\[1em]

\\begin{alignedat}{2}
& H = ${H_2x2_LaTeX}
&\\quad &\\begin{aligned}
H|\\Psi_4\\rangle &= H\\left(\\tfrac{1}{\\sqrt{2}}(|00\\rangle - |10\\rangle)\\right) \\
= \\tfrac{1}{\\sqrt{2}}(H|0\\rangle \\otimes |0\\rangle - H|1\\rangle \\otimes |0\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(\\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |0\\rangle - (\\tfrac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle) \\otimes |0\\rangle) \\\\
&= \\tfrac{1}{2}(|00\\rangle + |10\\rangle - |00\\rangle + |10\\rangle) \\
= |10\\rangle =  |\\Psi_5\\rangle
\\end{aligned}
\\end{alignedat}
`;

        const result = "\\textbf{Step 4: Bob Measures } \\Psi_5 \\\\[1em] |\\Psi_5\\rangle = |10\\rangle \\xrightarrow{\\text{Measurement}} 10 "

        derivs.push(Z_gate_step)
        derivs.push(cnot)
        derivs.push(h_bob)
        derivs.push(result)
        break
      }

      case "XZ": {
        const XZ_gate_step = `
\\textbf{Step 3: Alice applies XZ on }|\\Psi_2\\rangle \\\\[1em]

\\begin{alignedat}{2}
& XZ = \\begin{bmatrix}0 & -1 \\\\ 1 & 0\\end{bmatrix} 
&\\quad &\\begin{aligned}
XZ|\\Psi_2\\rangle &= XZ\\left(\\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)\\right) \\\\
&= \\tfrac{1}{\\sqrt{2}}(XZ|0\\rangle \\otimes |0\\rangle + XZ|1\\rangle \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(|1\\rangle \\otimes |0\\rangle - |0\\rangle \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(|10\\rangle - |01\\rangle) = |\\Psi_3\\rangle
\\end{aligned}
\\end{alignedat}
`;
        const cnot =
          "\\textbf{Step 4: Bob applies CNOT on } \\Psi{3} \\\\[1em]" +
          CNOT_LaTeX + " \\\\[0.75em]" +
          "\\Psi{3} \\Rightarrow \\tfrac{1}{\\sqrt{2}}(|10\\rangle - |01\\rangle) \\xrightarrow{\\text{CNOT}} " +
          "\\tfrac{1}{\\sqrt{2}}(|11\\rangle - |01\\rangle) = \\Psi{4} ";


        const h_bob = `
\\textbf{Step 3: Bob applies H on }|\\Psi_4\\rangle \\\\[1em]

\\begin{alignedat}{2}
& H = ${H_2x2_LaTeX}
&\\quad &\\begin{aligned}
H|\\Psi_4\\rangle &= H\\left(\\tfrac{1}{\\sqrt{2}}(|11\\rangle - |01\\rangle)\\right) \\
= \\tfrac{1}{\\sqrt{2}}(H|1\\rangle \\otimes |1\\rangle - H|0\\rangle \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{\\sqrt{2}}(\\tfrac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle) \\otimes |1\\rangle - (\\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |1\\rangle) \\\\
&= \\tfrac{1}{2}(|01\\rangle - |11\\rangle - |01\\rangle - |11\\rangle) \\
= -|11\\rangle =  |\\Psi_5\\rangle
\\end{aligned}
\\end{alignedat}
`;

        const result = "\\textbf{Step 4: Bob Measures } \\Psi_5 \\\\[1em] |\\Psi_5\\rangle = -|11\\rangle \\xrightarrow{\\text{Measurement}} 11 "

        derivs.push(XZ_gate_step)
        derivs.push(cnot)
        derivs.push(h_bob)
        derivs.push(result)
        break
      }

      default: {
        derivs.push("\\text{Unknown encoding}")
      }
    }

    return derivs
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
              if (idx === alicePaths.length - 1 && i === input.length - 1) {
                onComplete()
              }
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
          <path id="alice3" d={`M ${width * 0.30} 0 l ${width * 0.17} 0`} fill="none" stroke="#00ffff" strokeWidth="2" />
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
          <path id="bob3" d={`M ${width * 0.30} 0 l ${width * 0.17} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
          <path id="bob4" d={`M ${width * 0.48} 0 l ${width * 0.15} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
          <path id="bob5" d={`M ${width * 0.6} 0 l ${width * 0.15} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
          <path id="bob6" d={`M ${width * 0.75} 0 l ${width * 0.15} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
          <path id="bob7" d={`M ${width * 0.9} 0 l ${width * 0.15} 0`} fill="none" stroke="#ff00ff" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute bg-[#ff00ff] h-[1px] w-full top-1/2"></div>

      <div id="outp" className="absolute top-[57%] left-20 bg-[#1f1f2e] text-[#00ffff] rounded-md shadow-[0_0_12px_#00ffff] flex justify-center items-center text-l font-bold h-50 w-[80%]"></div>

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
      <div className="absolute top-[calc(50%-1.8rem)] z-1 left-305 size-15 flex justify-center items-center bg-[#00ff85] text-black rounded-md shadow-[0_0_10px_#00ff85]">O</div>

      <div className="absolute bg-[#0a0a1a] size-20 top-0 left-0 z-10"></div>
    </div>
  )
}

