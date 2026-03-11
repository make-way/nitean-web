export async function processImageToWebpAndResize(
  file: File,
  width: number = 1080,
  height: number = 1080
): Promise<File> {
  // Only process images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(file); // fallback if canvas is not supported or failed
        return;
      }

      // Calculate logic for object-fit: cover (fill the 1080x1080 space without stretching)
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width / 2) - (img.width / 2) * scale;
      const y = (height / 2) - (img.height / 2) * scale;

      // Draw the image on the canvas
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      const tryCompress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              if (blob.size > 150 * 1024 && quality > 0.1) {
                // If larger than 150KB and we can still reduce quality
                tryCompress(quality - 0.1);
              } else {
                const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                const newFile = new File([blob], fileName, {
                  type: 'image/webp',
                  lastModified: Date.now(),
                });
                resolve(newFile);
              }
            } else {
              resolve(file); // fallback
            }
          },
          'image/webp',
          quality
        );
      };

      tryCompress(0.9); // Start with quality 0.9
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // fallback
    };

    img.src = url;
  });
}

export async function processFilesForUpload(files: File[]): Promise<File[]> {
  const processedFiles = [];
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const processed = await processImageToWebpAndResize(file);
      processedFiles.push(processed);
    } else {
      processedFiles.push(file);
    }
  }
  return processedFiles;
}
