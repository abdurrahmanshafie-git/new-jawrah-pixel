import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  try {
    const { message, history, region } = (req.body ?? {}) as {
      message?: string;
      history?: Array<{ role: "user" | "model"; parts: string }>;
      region?: string;
    };

    if (!message) {
      return res.status(400).json({ ok: false, error: 'Message is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ ok: false, error: 'AI service not configured.' });
    }

    const client = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are the Jawrah Pixel Business Assistant. You are helpful, professional, and talk like a real human.

Current Context:
- Region: ${region || 'int'}
- Market: ${region ? {lk: 'Sri Lanka', pk: 'Pakistan', int: 'International'}[region] || 'International'}
- Currency: ${region ? {lk: 'LKR', pk: 'PKR', int: 'USD'}[region] || 'USD'}

Service Timelines:
- Basic site: 3–7 days
- Business site: 1–2 weeks
- Ecommerce: 2–4 weeks
- Custom system: 4+ weeks

Rules:
1. Use ${region ? {lk: 'LKR', pk: 'PKR', int: 'USD'}[region] || 'USD'} for all prices. Never mix currencies unless comparing.
2. If the user asks for a price, give the range and explain that complexity affects the final quote.
3. Keep responses concise but helpful. Don't over-explain.
4. Understand short messages like "hi", "bro", "price?", "need website". Respond naturally.
5. If the region is unknown or the user asks about other areas, mention we support Sri Lanka, Pakistan, and International clients.
6. If asked "why website?", explain business benefits like credibility, 24/7 sales, and global reach.
7. When a project interest is shown, suggest starting a project brief on the Contact page or using Start Project in chat after login.
8. If the user is not logged in and asks to submit/start a project, tell them to login or create an account first.
9. Always be polite and confident. You represent an elite digital agency.

User message: ${message}`;

    const conversation = history
      .map((h) => `${h.role === "model" ? "Assistant" : "User"}: ${h.parts}`)
      .join("\n");

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}\n\nConversation history:\n${conversation || "No previous messages."}`,
    });

    return res.status(200).json({ ok: true, text: response.text || "I'm here and ready to help." });
  } catch (error: any) {
    console.error('[gemini] API error:', error);
    return res.status(500).json({ ok: false, error: 'AI service temporarily unavailable.' });
  }
}
