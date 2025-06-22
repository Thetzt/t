export default async function handler(req, res) {
  const apiKey = process.env.JAP_API_KEY;

  const response = await fetch("https://justanotherpanel.com/api/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      key: apiKey,
      action: "balance"
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
