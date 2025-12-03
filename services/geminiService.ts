import { GoogleGenAI } from "@google/genai";
import { Doctor } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Chatbot functionality
export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are a helpful and empathetic AI assistant for DermoScan AI, a skin health screening app. You CANNOT diagnose skin cancer or medical conditions. You CAN explain the ABCDE rule, general skin health tips, and the importance of sun protection. If a user describes a specific lesion or asks for a diagnosis, gently refuse and urge them to see a dermatologist. Keep responses concise and easy to understand."
    }
  });
};

// Mock Data for Fallback
const MOCK_NEARBY_RESULTS: Doctor[] = [
  {
    name: "Skin Health Institute",
    address: "123 Medical Center Blvd, Suite 200",
    rating: "4.8",
    uri: "https://maps.google.com"
  },
  {
    name: "Dr. Sarah Jenning, MD",
    address: "45 Park Avenue Dermatology",
    rating: "4.9",
    uri: "https://maps.google.com"
  },
  {
    name: "City General Dermatology Clinic",
    address: "889 Broadway, Floor 4",
    rating: "4.5",
    uri: "https://maps.google.com"
  }
];

// Doctor Locator functionality using Google Maps Grounding
export const findNearbyDermatologists = async (lat: number, lng: number): Promise<Doctor[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find 3 highly-rated dermatologists near my location. Return their names, addresses, and ratings if available.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const doctors: Doctor[] = [];

    if (groundingChunks) {
      groundingChunks.forEach((chunk) => {
        if (chunk.web?.title && chunk.web?.uri) {
             doctors.push({
                name: chunk.web.title,
                uri: chunk.web.uri,
                address: "View on Map for details",
             });
        }
      });
    }
    
    // If no real results found (or API restriction), return mock data for prototype feel
    if (doctors.length === 0) {
        return MOCK_NEARBY_RESULTS;
    }

    return doctors.slice(0, 3);
  } catch (error) {
    console.warn("API Error or Geolocation issue, returning mock data:", error);
    // Return mock data so the UI is never empty in the prototype
    return MOCK_NEARBY_RESULTS;
  }
};