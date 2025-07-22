const axios = require('axios');
require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const getFinancialSuggestions = async (userInput) => {
  const prompt = `
You are a financial advisor. Based on this profile, suggest relevant financial products in simple language.

Profile:
${JSON.stringify(userInput, null, 2)}

Suggestions:
`;

  const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
    model: "qwen/qwen3-235b-a22b-07-25:free", // Or any other OpenRouter model
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
  }, {
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Financial Inclusion Advisor'
    }
  });

  return response.data.choices[0].message.content;
};

module.exports = { getFinancialSuggestions };
