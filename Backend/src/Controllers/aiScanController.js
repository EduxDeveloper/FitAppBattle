import { GoogleGenerativeAI } from "@google/generative-ai";
import foodItemModel from "../Models/foodItem.model.js";

// Inicializar SDK de Google (Asegúrate de poner tu API KEY en tu .env como GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiScanController = {};

aiScanController.scanFood = async (req, res) => {
  try {
    // La imagen debe venir en formato base64 desde el frontend
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: "No image provided" });
    }

    // 1. Configuramos el modelo de IA
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. Preparamos el "Prompt" (Las instrucciones exactas para la IA)
    const prompt = `
      You are an expert nutritionist AI. Analyze the food in this image.
      Provide a highly accurate estimation of the following nutritional values.
      You MUST respond ONLY with a valid JSON object matching this exact structure:
      {
        "name": "Name of the food",
        "servingSizeG": estimated total weight in grams (number),
        "calories": total calories (number),
        "proteinG": total protein in grams (number),
        "carbsG": total carbohydrates in grams (number),
        "fatsG": total fats in grams (number),
        "aiConfidence": your confidence level from 0 to 100 (number)
      }
    `;

    // 3. Formateamos la imagen para que la IA la entienda
    const imageParts = [
      {
        inlineData: {
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""), // Limpiar prefijo si viene
          mimeType: mimeType || "image/jpeg",
        },
      },
    ];

    // 4. Enviamos a procesar a la IA
    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = await result.response.text();

    // 5. Limpiamos el texto por si la IA responde con bloques de código markdown (```json ...)
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    
    // Parseamos la respuesta de la IA
    const aiData = JSON.parse(cleanJson);

    // 6. Guardamos el resultado en la base de datos como un nuevo "Food Item"
    const newFoodItem = new foodItemModel({
      name: aiData.name,
      servingSizeG: aiData.servingSizeG,
      calories: aiData.calories,
      proteinG: aiData.proteinG,
      carbsG: aiData.carbsG,
      fatsG: aiData.fatsG,
      source: "ai_scan", // Indicamos que viene de la IA
      aiConfidence: aiData.aiConfidence,
    });

    await newFoodItem.save();

    // 7. Retornamos el objeto al frontend
    res.status(200).json({
      message: "Food analyzed successfully",
      data: newFoodItem,
    });

  } catch (error) {
    console.error("Error AI scanning:", error);
    res.status(500).json({ message: "Failed to analyze image with AI", error: error.message });
  }
};

export default aiScanController;
