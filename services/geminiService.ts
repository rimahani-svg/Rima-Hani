import { GoogleGenAI, Type } from "@google/genai";
import { PolicyDocument } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parsePolicyFromImage = async (base64Image: string): Promise<PolicyDocument> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze the provided image of a company policy or code of conduct.
    Extract the text and structure it into a JSON format.
    The content is likely in Arabic.
    Identify the Company Name, the Document Title, and split the content into logical sections with titles and a list of specific rules/points for each section.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png", // Assuming PNG or JPEG, generic handling
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING, description: "Name of the company mentioned" },
            documentTitle: { type: Type.STRING, description: "Title of the document (e.g. Code of Conduct)" },
            date: { type: Type.STRING, description: "Date if present, or current date" },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  rules: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["title", "rules"]
              }
            }
          },
          required: ["companyName", "documentTitle", "sections"]
        }
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as PolicyDocument;
    }
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Error parsing policy:", error);
    throw new Error("Failed to extract policy text. Please try again.");
  }
};