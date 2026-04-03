import {puter} from "@heyputer/puter.js";
import {buildRoofPrompt} from "./constants";

export const fetchAsDataUrl = (url: string): Promise<string> => {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      return response.blob();
    })
    .then((blob) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert blob to Data URL"));
          }
        };
        reader.onerror = () => {
          reject(new Error("Error reading blob as Data URL"));
        };
        reader.readAsDataURL(blob);
      });
    });
};

const getImageDimensions = (dataUrl: string): Promise<{w: number, h: number}> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 1024, h: 1024 });
    img.src = dataUrl;
  });

export const generate3DView = async ({ sourceImage, roofMaterial, roofColor }: Generate3DViewParams) => {
  const dataUrl = sourceImage.startsWith('data:')
  ? sourceImage
      : await fetchAsDataUrl(sourceImage);

  const base64Data = dataUrl.split(',')[1];
  const mimeType = dataUrl.split(';')[0].split(':')[1];

  if(!mimeType || !base64Data) throw new Error('Invalid source image payload');

  const { w, h } = await getImageDimensions(dataUrl);
  const prompt = buildRoofPrompt(roofMaterial || 'Galvanized Iron', roofColor || '#1B3F6B');

  const response = await puter.ai.txt2img(prompt, {
      provider: 'gemini',
      model: 'gemini-2.5-flash-image-preview',
      input_image: base64Data,
      input_image_mime_type: mimeType,
      ratio: { w, h }
  });

  const rawImageUrl = (response as HTMLImageElement).src ?? null;

  if (!rawImageUrl) return { renderedImage: null, renderedPath: undefined };

  const renderedImage = rawImageUrl.startsWith('data:')
  ? rawImageUrl : await fetchAsDataUrl(rawImageUrl);

  return {renderedImage, renderedPath: undefined};
}
