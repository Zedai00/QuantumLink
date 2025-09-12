import { useContext } from "react";
import { Context } from "../Context/Context";

export default function SettingsPage() {
  const { settings, onSettingsChange } = useContext(Context);

  const handleErrorRateChange = (e) => {
    onSettingsChange({ errorRate: parseFloat(e.target.value) });
  };

  return (
    <div className="p-6 bg-[#030313] text-white h-full w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-cyan-300 mb-4">⚙ Settings</h2>

      {/* Error Rate */}
      <div>
        <label className="block mb-2 font-medium">Error Rate</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.errorRate ?? 0}
          onChange={handleErrorRateChange}
          className="w-64 accent-cyan-500"
        />
        <span className="ml-3 text-cyan-300">{settings.errorRate ?? 0}</span>
      </div>

      {/* Noise Mode */}
      <div>
        <label className="text-gray-200 text-sm font-medium mb-1 block">
          Noise Mode:
        </label>
        <select
          value={settings.noiseMode || "bit-flip"}
          onChange={(e) =>
            onSettingsChange({ noiseMode: e.target.value })
          }
          className="w-full p-1 rounded bg-[#0f0f1f] border border-cyan-400/40 text-cyan-200"
        >
          <option value="bit-flip">Bit Flip</option>
          <option value="phase-flip">Phase Flip</option>
          <option value="depolarizing">Depolarizing</option>
          <option value="combined">Combined</option>
        </select>
      </div>
    </div>
  );
}

