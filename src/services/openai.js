export const fetchChatCompletion = async (messages) => {
  const res = await fetch("/api/openai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error("Failed to fetch response");
  return await res.json();
};
