import React, { useState } from "react";
import BinaryEncoder from "./BinaryEncoder";
import BinaryDecoder from "./BinaryDecoder";
import BinarySplitter from "./BinarySplitter";
import BinaryJoiner from "./BinaryJoiner";
import Entangle from "./Entangle";
import GateDetection from "./GateDetection";
import BinaryDetection from "./BinaryDetection";
import "./App.css";

export default function App() {
  const [selected, setSelected] = useState("BinaryEncoder");

  const renderComponent = () => {
    switch (selected) {
      case "BinaryEncoder":
        return <BinaryEncoder />;
      case "BinaryDecoder":
        return <BinaryDecoder />;
      case "BinarySplitter":
        return <BinarySplitter />;
      case "BinaryJoiner":
        return <BinaryJoiner />;
      case "Entangle":
        return <Entangle />;
      case "GateDetection":
        return <GateDetection />;
      case "BinaryDetection":
        return <BinaryDetection />;
      default:
        return <BinaryEncoder />;
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Quantum World</h1>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="BinaryEncoder">Binary Encoder</option>
          <option value="BinaryDecoder">Binary Decoder</option>
          <option value="BinarySplitter">Binary Splitter</option>
          <option value="BinaryJoiner">Binary Joiner</option>
          <option value="Entangle">Entangle</option>
          <option value="GateDetection">Gate Detection</option>
          <option value="BinaryDetection">Binary Detection</option>
        </select>
      </header>
      <main>{renderComponent()}</main>
    </div>
  );
}
