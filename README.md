# Botani-Buddy
# 🌿 Plant Buddy - AI Plant Scanner

**Upload plant photos → Get instant ID, Hindi/Marathi names, Pune gardening tips, medicinal uses.** Built for Indian gardeners with React + Node.js + Perplexity API.


## ✨ Features
- Image upload (file/base64) with loading states
-  Localized care: sunlight, watering, pests (neem oil), monsoon tips
-  Medicinal uses, advantages/disadvantages
-  Mobile-responsive for field use

## 🏗️ Architecture

```mermaid
graph TD
    A[User uploads image] --> B[React Frontend]
    B --> C[Axios POST /api/plant-info]
    C --> D[Node.js/Express Backend]
    D --> E[Perplexity API]
    E --> F[Plant analysis JSON]
    F --> D --> B --> G[Display: गुलाब care tips]
| Frontend           | Backend         | APIs                     |
| ------------------ | --------------- | ------------------------ |
| React 18           | Node.js/Express | Perplexity Vision        |
| Axios              | dotenv/CORS     | .env API key             |
| useState/useEffect | multer uploads  | JSON structured response |


**Project Structure
text
plant-buddy/
├── backend/
│   ├── server.js      # Express + Perplexity
│   ├── .env.example
│   └── uploads/       # Temp images
├── frontend/
│   ├── src/
│   │   ├── Plant.js   # Image upload component
│   │   └── App.css
│   └── public/
├── README.md
└── package.json
