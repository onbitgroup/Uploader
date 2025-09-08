import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const data = req.body;
  const timestamp = Date.now();
  const filename = `post-${timestamp}.json`;

  const gistPayload = {
    description: "New product post",
    public: false,
    files: {
      [filename]: {
        content: JSON.stringify(data, null, 2)
      }
    }
  };

  try {
    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        "Authorization": `token ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(gistPayload)
    });

    const result = await response.json();
    res.status(200).json({ message: "Post uploaded successfully!", gistUrl: result.html_url });
  } catch (error) {
    res.status(500).json({ message: "Error uploading post", error: error.message });
  }
}
