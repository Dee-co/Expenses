import Tesseract from "tesseract.js";

export async function extractBillText(file: File) {
  const { data } = await Tesseract.recognize(file, "eng", {
    logger: (info) => {
      console.log(info);
    },
  });

  return data.text;
}