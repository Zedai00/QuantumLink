// src/utils/binaryUtils.js

// Split binary string into 2-bit chunks
export const splitBinaryIntoPairs = (binaryArray) => {
  return binaryArray.map((item) =>
    item.split("").reduce((acc, char, index) => {
      if (index % 2 === 0) acc.push("");
      acc[acc.length - 1] += char;
      return acc;
    }, [])
  );
};
