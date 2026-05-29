import * as GoogleGenAI from "@google/genai";
import { appEnv } from "./env";

// Accessing from the namespace if the direct export is failing in build
const GoogleGenerativeAI = (GoogleGenAI as any).GoogleGenerativeAI || GoogleGenAI.default?.GoogleGenerativeAI;

const genAI = GoogleGenerativeAI ? new GoogleGenerativeAI(appEnv.geminiApiKey) : null;

export const REGION_CONFIG = {
  lk: {
    label: "Sri Lanka",
    currency: "LKR",
    market: "Sri Lankan",
    paymentMethods: ["PayHere", "OnePay", "Bank Transfer"],
    packages: {
      starter: "LKR 80,000 – 150,000",
      business: "LKR 150,000 – 350,000",
      ecommerce: "LKR 250,000 – 700,000+",
      custom: "LKR 500,000+"
    }
  },
  pk: {
    label: "Pakistan",
    currency: "PKR",
    market: "Pakistani",
    paymentMethods: ["JazzCash", "EasyPaisa", "Bank Transfer"],
    packages: {
      starter: "PKR 80,000 – 180,000",
      business: "PKR 180,000 – 450,000",
      ecommerce: "PKR 300,000 – 900,000+",
      custom: "PKR 700,000+"
    }
  },
  int: {
    label: "International",
    currency: "USD",
    market: "international",
    paymentMethods: ["Stripe", "PayPal", "Wise", "Bank Transfer"],
    packages: {
      starter: "$300 – $700",
      business: "$700 – $1,500",
      ecommerce: "$1,500 – $5,000+",
      custom: "$3,000+"
    }
  }
};

export async function getChatResponse(message: string, history: { role: "user" | "model", parts: string }[], region: string) {
  if (!appEnv.geminiApiKey) {
    throw new Error("Gemini API key is missing");
  }

  if (!genAI) {
    throw new Error("Generative AI client failed to initialize");
  }

  const regionInfo = REGION_CONFIG[region as keyof typeof REGION_CONFIG] || REGION_CONFIG.int;
  
  const systemPrompt = `You are the Jawrah Pixel Business Assistant. You are helpful, professional, and talk like a real human. 
  Your tone should match the user's: if they are casual, be friendly; if they are professional, be serious.
  
  Current Context:
  - Region: ${regionInfo.label}
  - Market: ${regionInfo.market}
  - Currency: ${regionInfo.currency}
  - Payment Methods: ${regionInfo.paymentMethods.join(", ")}
  - Packages: 
    * Starter: ${regionInfo.packages.starter}
    * Business: ${regionInfo.packages.business}
    * Ecommerce: ${regionInfo.packages.ecommerce}
    * Custom System: ${regionInfo.packages.custom}
  
  Service Timelines:
  - Basic site: 3–7 days
  - Business site: 1–2 weeks
  - Ecommerce: 2–4 weeks
  - Custom system: 4+ weeks
  
  Rules:
  1. Use ${regionInfo.currency} for all prices. Never mix currencies unless comparing.
  2. If the user asks for a price, give the range from the packages and explain that complexity affects the final quote.
  3. Keep responses concise but helpful. Don't over-explain.
  4. Understand short messages like "hi", "bro", "price?", "need website". Respond naturally.
  5. If the region is unknown or the user asks about other areas, mention we support Sri Lanka, Pakistan, and International clients.
  6. If asked "why website?", explain business benefits like credibility, 24/7 sales, and global reach.
  7. When a project interest is shown, suggest starting a project brief or moving to WhatsApp for a detailed quote.
  8. Always be polite and confident. You represent an elite digital agency.
  
  User message: ${message}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
    });

    const result = await chat.sendMessage(systemPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
