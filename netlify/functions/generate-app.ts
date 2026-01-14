import { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // CORS Preflight kontrolü
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  // Sadece POST isteklerine izin ver
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // API anahtarını environment variable'dan al
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("❌ Environment Error: API_KEY is not defined in Netlify.");
      console.error("Please set API_KEY in Netlify Dashboard → Site Settings → Environment Variables");
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "API_KEY environment variable is not configured.",
          hint: "Please add API_KEY to your Netlify environment variables."
        }),
      };
    }

    const requestBody = JSON.parse(event.body || "{}");
    const userPrompt = requestBody.prompt;

    if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Valid prompt is required." }),
      };
    }

    console.log("📝 Received prompt:", userPrompt.substring(0, 100) + "...");

    // Enhanced system instruction with examples
    const systemInstruction = `You are an expert AI application architect. Create rich, interactive application demos based on user requests.

CRITICAL: Return ONLY a raw JSON object. NO markdown, NO backticks, NO explanatory text.

Available Element Types:
1. "chat" - AI chat interface with messages array
2. "workflow" - Visual workflow with nodes and connections
3. "agent" - AI agent card with capabilities
4. "data-viz" - Charts (bar/metric/progress) with metrics
5. "timeline" - Process timeline with events
6. "kanban" - Kanban board with kanbanColumns
7. "api-connector" - API endpoint display
8. "code-block" - Code snippet display
9. "heading" - Section heading
10. "card" - Info card
11. "input" - Form input
12. "button" - Action button
13. "table" - Data table

Schema Structure:
{
  "appName": "string",
  "description": "string",
  "elements": [...]
}

EXAMPLES:

For "Create a customer support chatbot":
{
  "appName": "AI Customer Support",
  "description": "Intelligent customer support assistant",
  "elements": [
    {
      "id": "1",
      "type": "chat",
      "label": "Customer Support Chat",
      "messages": [
        {"role": "assistant", "content": "Hello! How can I help you today?", "timestamp": "10:00 AM"},
        {"role": "user", "content": "I need help with my order", "timestamp": "10:01 AM"},
        {"role": "assistant", "content": "I'd be happy to help! Can you provide your order number?", "timestamp": "10:01 AM"}
      ]
    },
    {
      "id": "2",
      "type": "agent",
      "label": "Support Agent",
      "description": "AI-powered customer support",
      "status": "active",
      "capabilities": ["Order Tracking", "Returns & Refunds", "Product Information", "Technical Support"]
    }
  ]
}

For "Build a workflow automation tool":
{
  "appName": "Workflow Automation",
  "description": "Automate your business processes",
  "elements": [
    {
      "id": "1",
      "type": "workflow",
      "label": "Email Processing Workflow",
      "nodes": [
        {"id": "1", "type": "trigger", "label": "New Email", "description": "Trigger on new email"},
        {"id": "2", "type": "ai", "label": "Analyze Content", "description": "AI analyzes email"},
        {"id": "3", "type": "condition", "label": "Check Priority", "description": "Check if urgent"},
        {"id": "4", "type": "action", "label": "Send Response", "description": "Auto-respond"}
      ],
      "connections": [
        {"from": "1", "to": "2"},
        {"from": "2", "to": "3"},
        {"from": "3", "to": "4"}
      ]
    }
  ]
}

For "Design a sales dashboard":
{
  "appName": "Sales Analytics",
  "description": "Real-time sales performance dashboard",
  "elements": [
    {
      "id": "1",
      "type": "data-viz",
      "label": "Key Metrics",
      "chartType": "metric",
      "metrics": [
        {"label": "Total Sales", "value": "$125K"},
        {"label": "New Customers", "value": "342"},
        {"label": "Conversion Rate", "value": "24%"}
      ]
    },
    {
      "id": "2",
      "type": "data-viz",
      "label": "Sales by Region",
      "chartType": "bar",
      "metrics": [
        {"label": "North", "value": 85, "color": "bg-blue-500"},
        {"label": "South", "value": 65, "color": "bg-green-500"},
        {"label": "East", "value": 92, "color": "bg-purple-500"},
        {"label": "West", "value": 78, "color": "bg-orange-500"}
      ]
    }
  ]
}

GUIDELINES:
- Use 3-6 elements per app
- Mix different element types for rich demos
- Include realistic data and examples
- For chat: 3-5 messages showing conversation
- For workflow: 3-5 nodes showing process
- For agents: 3-5 capabilities
- For data-viz: 3-5 metrics with colors
- Make it visually impressive and interactive
- Focus on the core functionality requested

Return ONLY the JSON object, nothing else.`;

    // v1beta API için doğru model adı (2026'da mevcut)
    const model = "gemini-2.5-flash";

    // Gemini API endpoint - API Key URL parametresi olarak gönderiliyor
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    console.log("🚀 Calling Gemini API with model:", model);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemInstruction}\n\nUser Request: ${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Gemini API Error Status:", response.status);
      console.error("❌ Gemini API Response:", JSON.stringify(data, null, 2));

      // Daha açıklayıcı hata mesajları
      let errorMessage = "Gemini API request failed";
      if (response.status === 400) {
        errorMessage = "Invalid request to Gemini API. Please check your prompt.";
      } else if (response.status === 401 || response.status === 403) {
        errorMessage = "API key is invalid or doesn't have permission.";
      } else if (response.status === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      } else if (response.status === 500) {
        errorMessage = "Gemini API server error. Please try again.";
      }

      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({
          error: errorMessage,
          details: data,
          status: response.status
        }),
      };
    }

    console.log("✅ Gemini API response received successfully");

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err: any) {
    console.error("❌ Netlify Function Exception:", err);
    console.error("Stack trace:", err.stack);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: err.message,
        hint: "Check Netlify function logs for more details."
      }),
    };
  }
};
