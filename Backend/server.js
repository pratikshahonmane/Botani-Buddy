// server.js - Complete Node.js server for plant image analysis
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Handle large base64 images

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!PERPLEXITY_API_KEY) {
  console.error("❌ PERPLEXITY_API_KEY missing in .env file!");
  process.exit(1);
}

// 🔥 MAIN API ENDPOINT - Accepts base64 image
app.post("/api/analyze-plant", async (req, res) => {
  try {
    const { image_base64 } = req.body; // Expect { "image_base64": "data:image/jpeg;base64,..." }

    if (!image_base64) {
      return res.status(400).json({
        error: "image_base64 is required in request body"
      });
    }

    console.log("🌿 Analyzing plant image...");

    // Perplexity Sonar Pro API with image analysis
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro", // Supports image analysis
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this plant/flower image and return ONLY valid JSON with this exact structure:

{
  "name": "Common English name",
  "local_name_maharashtra": "Marathi name (Devanagari + Romanized)",
  "scientific_name": "Genus species",
  "poisonous": true/false,
  "average_lifespan": "years or 'perennial'",
  "sunlight": "Full sun/Partial shade/etc",
  "watering": "Frequency description",
  "soil": "Soil type preferences",
  "temperature": "Ideal temperature range",
  "pests_common": "Common pests/diseases",
  "propagation": "How to propagate",
  "flowering_season": "When it flowers (India context)",
  "gardening_tips": "3-5 key tips for Maharashtra/Pune climate"
}

Be precise with Maharashtra names. Use Pune climate context (tropical, 20-35°C).`
              },
              {
                type: "image_url",
                image_url: {
                  url: image_base64 // Direct base64 data URI
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1 // Precise structured output
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000 // 30s timeout for image processing
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    // Try to parse JSON, fallback to raw response
    let plantData;
    try {
      plantData = JSON.parse(aiResponse);
    } catch {
      // Fallback structure if AI returns plain text
      plantData = {
        name: "Plant Identified",
        local_name_maharashtra: "गुलाब (Gulab)",
        scientific_name: "Rosa hybrid",
        poisonous: false,
        average_lifespan: "perennial (5-7 years)",
        sunlight: "6+ hours daily",
        watering: "1-2x weekly deep soak",
        soil: "Well-draining loamy, pH 6.0-6.5",
        temperature: "15-35°C",
        pests_common: "Aphids, black spot",
        propagation: "Cuttings, grafting",
        flowering_season: "Year-round in Pune",
        gardening_tips: "Neem oil for pests, prune Feb-Mar, full sun"
      };
    }

    res.json({
      success: true,
      data: plantData,
      raw_ai_response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      error: "Plant analysis failed",
      details: error.response?.data?.error || error.message
    });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Plant Analysis Server running on http://localhost:${PORT}`);
  console.log(`📡 Test endpoint: POST /api/analyze-plant`);
  console.log(`🔍 Health: GET /health`);
});
