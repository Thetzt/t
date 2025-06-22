export default async function handler(req, res) {
  const response = await fetch("https://justanotherpanel.com/api/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      key: "7590d2173f1e2fe1ef245261a99aa5bf",
      action: "balance"
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
