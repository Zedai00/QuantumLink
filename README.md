# 🌌 QuantumLink: Interactive Simulation of the Superdense Coding Protocol

> **An Integrated Visualization and Simulation Platform for Quantum Communication**

**Authors:**  
Jishan Alam · Amarjeet Kumar · Md Sohail Ansari · Aruna Kamara · Kotagiri Keerthi Sri · Grandi Radhika Naga Sai Laxmi Santhoshi  
**Institution:** Department of Computer Science and Engineering, Godavari Institute of Engineering & Technology (Autonomous), Rajahmundry, Andhra Pradesh, India  
**Hackathon:** *Amaravati Quantum Valley Hackathon 2025 (AQVH 2025)*  
**Live Demo:** [quantum-link-eight.vercel.app](https://quantum-link-eight.vercel.app)  
**Repository:** [github.com/zedai00/quantumlink](https://github.com/zedai00/quantumlink)

---

## 🧠 Overview

**QuantumLink** is an **interactive quantum communication simulator** designed to demonstrate the **Superdense Coding** protocol in a dynamic and visually intuitive way.  
The system models each stage of the protocol — entanglement, encoding, transmission, and decoding — while offering an **interactive 3D visualization** of the underlying quantum state transformations.

The architecture separates **user interaction**, **quantum state simulation**, and **visualization**, making it extendable for research, education, and potential integration with **quantum computing backends** such as Qiskit, Cirq, or Braket.

---

## ✨ Core Features

- ⚛️ **End-to-End Protocol Simulation**  
  Implements Superdense Coding at the logical gate level with accurate qubit state evolution.

- 🔁 **Modular Architecture**  
  Layered design with decoupled computation, visualization, and user interface modules.

- 💬 **Interactive Visualization Interface**  
  Real-time 3D rendering of Bloch spheres and circuit-level quantum operations.

- 🧮 **Mathematical Precision**  
  Quantum states represented as complex vectors; gates applied via linear algebraic transformations.

- 🧠 **Extensible Framework**  
  Supports plug-in expansion for new communication protocols or quantum gate sets.

---

## 🧰 Technology Stack

| Layer | Tools / Frameworks |
|-------|--------------------|
| **Interface Layer** | React, TypeScript |
| **Computation Core** | Custom matrix and tensor engine for state simulation |
| **Visualization Engine** | Three.js, Anime.js, Framer Motion |
| **Mathematical Rendering** | KaTeX |
| **Optional Integrations** | Qiskit / Cirq (planned) |
| **Deployment** | Vercel / Docker ready |

---

## ⚙️ System Architecture

QuantumLink uses a modular multi-layer design:

1. **Input Layer** – Parses user input (text or image) into binary representation.  
2. **Encoding Layer** – Maps binary segments into quantum gate operations (I, X, Z, XZ).  
3. **Simulation Core** – Computes qubit transformations via matrix multiplications and tensor products.  
4. **Visualization Layer** – Renders state vectors, Bloch sphere movements, and gate sequences.  
5. **Decoding Layer** – Reconstructs transmitted information from the resulting measurements.

---

## 🔢 Bit-to-Gate Mapping

| Bits | Quantum Gate | Description |
|------|---------------|--------------|
| 00 | I | Identity |
| 01 | X | Pauli-X (bit flip) |
| 10 | Z | Pauli-Z (phase flip) |
| 11 | XZ | Pauli-X followed by Z |

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/zedai00/quantumlink.git
cd quantumlink

# Install dependencies
npm install

# Run the development server
npm run dev
```

Then open your browser at **http://localhost:3000**  
or explore the hosted version:  
👉 [quantum-link-eight.vercel.app](https://quantum-link-eight.vercel.app)

---

## 📊 Results & Capabilities

- ✅ Correct state evolution across encoding, entanglement, and decoding  
- 🎞️ Real-time visualization of qubit operations with Bloch sphere transitions  
- 🧮 Mathematically accurate matrix transformations and measurement outcomes  
- 🧩 Designed for easy integration with quantum simulators or APIs  

---

## 🔬 Comparative Positioning

| Platform | Visualization | Interactivity | Quantum Hardware |
|-----------|----------------|----------------|------------------|
| IBM Quantum Experience | Circuit-based | Low | Required |
| Qiskit Textbook | Code + Circuit | Medium | Optional |
| **QuantumLink** | Bloch + Circuit | **High** | Optional / Simulated ✅ |

---

## 💡 Future Enhancements

- Integration with **Qiskit / Cirq / Braket** APIs for backend execution  
- Simulation of additional protocols (Teleportation, QKD, Error Correction)  
- Extended qubit visualization (multi-qubit entanglement surfaces)  
- Metrics for **fidelity**, **state overlap**, and **measurement probabilities**  
- Collaborative “multi-node” visualization for distributed quantum networks  

---

## 🏆 Acknowledgements

Gratitude to:

- **Amaravati Quantum Valley Hackathon 2025 (AQVH 2025)** — APSCHE Initiative  
- **RGUKT Nuzvid** — Quantum Bootcamp Partner  
- **IBM, TCS, UNESCO, QKrishi Quantum, Quanfluence Pvt. Ltd.** — Technical Collaborators  
- **Faculty SPOC:** N. Madhuri, GIET Rajahmundry — Guidance and Mentorship  

---

## 📜 License

Distributed under the **MIT License**.  
See [LICENSE](./LICENSE) for details.

---

## 🧭 Vision

> *To make quantum communication systems understandable, interactive, and accessible—bridging the gap between theory and intuition.*

---

### 🔗 Useful Links

- 📂 **Repository:** [github.com/zedai00/quantumlink](https://github.com/zedai00/quantumlink)  
- 🌐 **Live Demo:** [quantum-link-eight.vercel.app](https://quantum-link-eight.vercel.app)

---

Made with 💙 by the **Team Kronos** @ GIET Rajahmundry
