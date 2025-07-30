import axios from "axios";

export const getOpenAIResponse = async (message: string, apiKey: string) => {
  const response = await axios.post(import.meta.env.VITE_BOT_URL,
    {
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: message }],
    },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_BOT_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};
