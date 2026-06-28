import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser to support local development environment variables
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      } else if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static assets from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// API Endpoint for AI Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, activeMode, customInstruction } = req.body;
    
    const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY or VITE_GROQ_API_KEY is not defined");
      return res.status(500).json({ error: "Groq API key not configured on server" });
    }

    let systemPrompt = "";
    if (activeMode === "school") {
      systemPrompt = "You are the SuperWeb Admissions Assistant for a premium academy. Answer the user's questions about admissions guidelines, curriculum options, bus routes, facilities, and academic requirements. Keep your answers brief (under 3 sentences), highly professional, polite, and encouraging. Suggest contacting Prathap V on WhatsApp at 9606664929 for scheduling a campus visit.";
    } else if (activeMode === "business") {
      systemPrompt = "You are the SuperWeb Business Lead Assistant. Your goal is to showcase SuperWeb's digital services (websites, custom school portals, apps, AI chatbot workflows) and help capture the user's interest. Keep responses under 3 sentences. Be extremely helpful, clear, and proactive in suggesting booking a 10-minute consultation call with our founder Prathap V (WhatsApp: 9606664929).";
    } else {
      systemPrompt = customInstruction || "You are a helpful assistant.";
    }

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: apiMessages,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error response:", errorText);
      return res.status(response.status).json({ error: `Groq API error: ${response.status}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Server error during AI completion:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fallback to index.html for SPA routing (using general middleware as catch-all)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
