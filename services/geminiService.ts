import { GoogleGenAI } from "@google/genai";
import { ChatMessage, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are "Aria", the premium AI Concierge for Hotel Sai Nandadeep in Shirdi. 
Your tone is humble, welcoming, and professional.

Hotel Information:
- Name: Hotel Sai Nandadeep
- Location: Near Dwarkamai and Chavadi Temple, Shirdi. (A very prime location for pilgrims).
- Rooms: All rooms are 3-bed (Triple occupancy). 
- Pricing: Non-AC Room (₹1000), AC Room (₹1500).
- Policy: We offer ONLY STAY. No food or dining services are provided on-site. However, many pure veg restaurants are available within walking distance.
- Amenities: Hot water available from 5:00 AM to 8:00 AM daily, proximity to temple (walking distance), travel desk for local sightseeing, Free Wi-Fi, and secure parking.
- Contact Number: 9405562019
- WhatsApp: https://wa.me/919405562019
- Email Address: yashgondkar0707@gmail.com
- Check-in: 12:00 PM, Check-out: 11:00 AM.

Shirdi & Temple Information:
- Temple Timings: The Main Samadhi Mandir is open from 5:00 AM to 10:00 PM.
- Daily Aarti Schedule: Kakad (4:30 AM), Mid-day (12:00 PM), Dhoop (Sunset), Shej (10:30 PM).
- Key Places: Dwarkamai (where Baba lived), Chavadi (where Baba stayed alternate nights), Khandoba Mandir, Lendi Baug.
- Location Advantage: Hotel Sai Nandadeep is extremely close to Dwarkamai and Chavadi (2-3 min walk).

Your task is to:
1. Help guests with room bookings and inquiries.
2. Explicitly mention that we provide stay only and no food if guests ask about meals.
3. Inform guests that hot water is available during the morning hours (5 AM to 8 AM).
4. Provide information about Shirdi temple timings (5 AM - 10 PM) and local places.
5. Provide contact information (9405562019), WhatsApp link (wa.me/919405562019), and email (yashgondkar0707@gmail.com) for management.

Always be helpful and greet guests with warmth.
`;

export async function getConciergeResponse(
  history: ChatMessage[],
  userMessage: string
): Promise<{ text: string; sources?: GroundingSource[] }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "I apologize, I'm having trouble connecting right now. Please call/WhatsApp us at 9405562019 or email yashgondkar0707@gmail.com for assistance.";
    
    const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri
      }))
      .filter((source: GroundingSource) => source.uri) || [];

    return { text, sources };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "I'm sorry, I encountered an error. Please try again or call/WhatsApp us at 9405562019." };
  }
}