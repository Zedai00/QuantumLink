import React, { useState } from 'react';
import PixelToRGNB from './components/PixelToRGNB';
import AsciiToBinary from './components/AsciiToBinary';
import BinaryToAscii from './components/BinaryToAscii';
import RGBToPixel from './components/RGBToPixel';

export default function App() {
  const [rgbArray, setRgbArray] = useState([]);
  const [binaryArray, setBinaryArray] = useState([]);
  const [convertedRGB, setConvertedRGB] = useState([]);

  return (
    <div>
      {/* Step 1: Pixel to RGB */}
      <PixelToRGNB onPixels={(pixels) => setRgbArray(pixels)} />

      {/* Step 2: RGB to Binary */}
      {rgbArray.length > 0 && (
        <AsciiToBinary rgbArray={rgbArray} onBinary={(bArray) => setBinaryArray(bArray)} />
      )}

      {/* Step 3: Binary to RGB */}
      {binaryArray.length > 0 && (
        <BinaryToAscii binaryArray={binaryArray} onConverted={(rgb) => setConvertedRGB(rgb)} />
      )}

      {/* Step 4: RGB to Pixels Canvas */}
      {convertedRGB.length > 0 && (
        <RGBToPixel rgbArray={convertedRGB} />
      )}
    </div>
  );
}
