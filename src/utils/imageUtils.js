// src/utils/imageUtils.js

// Resize image to a smaller size (keep aspect ratio)
export function resizeImageToData(imageInput, size = 64) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;

    const img = new Image();
    img.crossOrigin = "Anonymous"; // prevent CORS issues

    // ✅ Handle different input types
    if (imageInput instanceof File || imageInput instanceof Blob) {
      img.src = URL.createObjectURL(imageInput);
    } else if (typeof imageInput === "string") {
      img.src = imageInput; // already a URL or base64 string
    } else {
      reject(new Error("Unsupported image input type"));
      return;
    }

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      resolve(ctx.getImageData(0, 0, size, size));
    };

    img.onerror = (err) => reject(err);
  });
}


// Convert image pixels to compressed binary representation
export const pixelsToBinary = (imageData) => {
  const { data, width, height } = imageData;
  const binaryArray = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = Math.floor(data[i] / 64);   // 2 bits
    const g = Math.floor(data[i + 1] / 64);
    const b = Math.floor(data[i + 2] / 64);

    const bin = (
      r.toString(2).padStart(2, "0") +
      g.toString(2).padStart(2, "0") +
      b.toString(2).padStart(2, "0")
    );

    binaryArray.push(bin);
  }

  return { binaryArray, width, height };
};
