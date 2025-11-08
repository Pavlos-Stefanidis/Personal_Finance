import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Προσθέστε αυτό στην αρχή του αρχείου, μετά τα imports
interface Transaction {
  type: "income" | "expense";
  amount: number;
  date: string;
}

interface MonthlyData {
  [key: string]: {
    income: number;
    expenses: number;
  }
}
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { transactions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare transaction data summary
    const totalIncome = transactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    transactions.forEach((t: any) => {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
    });

    const systemPrompt = `You are a financial advisor AI. Analyze the user's transaction history and provide insights about their spending patterns, income trends, and predictions for the next 3-6 months. Be specific, actionable, and encouraging. Focus on:
1. Current financial health
2. Spending patterns and trends
3. Income stability
4. Predicted future income and expenses
5. Recommendations for improvement

Keep the response concise (2-3 paragraphs) and easy to understand.`;

    const userPrompt = `Here is my financial data:
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpenses.toFixed(2)}
- Current Balance: $${(totalIncome - totalExpenses).toFixed(2)}
- Number of Transactions: ${transactions.length}

Monthly breakdown:
${Object.entries(monthlyData)
  .map(([month, data]) => `${month}: Income $${data.income.toFixed(2)}, Expenses $${data.expenses.toFixed(2)}`)
  .join("\n")}

Please analyze my financial situation and provide predictions for the next 3-6 months.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const prediction = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ prediction }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in financial-prediction:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
