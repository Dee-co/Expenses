import { authenticateRequest } from "@/lib/auth";
import axios from "axios";

const PROMPT = `
You are an expert bill and receipt data parser.
Convert the provided OCR text into structured JSON.
Extract:
1. title: Short meaningful expense title.
2. amount: Final total payable amount as a number.
3. date: Bill date in YYYY-MM-DD format.
4. category: Suitable expense category.
5. note: Shop name and short description.

IMPORTANT AMOUNT RULES:
- Find the final payable total from the OCR text.
- Ignore individual item prices.
- Ignore quantity and unit prices.
- Look near the bottom of the receipt for the final total.
- If the OCR contains a clearly visible final total, use it.
- Do not blindly select the first amount.
- Do not guess if the final total is unclear.
- For grocery bills, category should be "Food".

Return ONLY valid JSON:

{
  "title": "string or null",
  "amount": number or null,
  "date": "YYYY-MM-DD or null",
  "category": "string or null",
  "note": "string or null"
}
`;

interface GeminiResult {
  title: string | null;
  amount: number | null;
  date: string | null;
  category: string | null;
  note: string | null;
}
export async function POST(request: Request) {
  try {
    authenticateRequest(request);
    const apiKey = process.env.NEXT_GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }
    const body = await request.json();
    const ocrText = body.text;
    if (!ocrText || typeof ocrText !== "string") {
      return Response.json({ error: "OCR text is required" }, { status: 400 });
    }
    const model = "gemini-3.5-flash-lite";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${PROMPT}

OCR TEXT:
${ocrText}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0,
      },
    };
    console.log("GEMINI OCR PARSING STARTED");
    const response = await axios.post(geminiUrl, requestBody, {
      params: {
        key: apiKey,
      },
      headers: {
        "Content-Type": "application/json",
        Connection: "close",
      },
      timeout: 120000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return Response.json(
        { error: "Gemini returned an empty response" },
        { status: 502 }
      );
    }
    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    let result: GeminiResult;

    try {
      result = JSON.parse(cleanedText);
    } catch (error) {
      return Response.json(
        { error: "AI returned invalid JSON" },
        { status: 502 }
      );
    }
    if (
      result.amount !== null &&
      (typeof result.amount !== "number" ||
        !Number.isFinite(result.amount) ||
        result.amount < 0)
    ) {
      result.amount = null;
    }

    console.log("GEMINI OCR PARSING SUCCESS:", result);
    return Response.json(result, { status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      const apiError = error.response?.data?.error?.message;

      console.error("GEMINI API ERROR:", {
        status,
        message: apiError || error.message,
      });

      return Response.json(
        {
          error: apiError || "AI API request failed",
        },
        { status: status || 500 }
      );
    }
    console.error("OCR PARSING ERROR:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "OCR parsing failed",
      },
      { status: 500 }
    );
  }
}
