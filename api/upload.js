import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const data = req.body;
  const timestamp = Date.now();
  const filename = `post-${timestamp}.json`;

  const gistId = process.env.GIST_ID; // store your gist ID in Vercel env variables

  const payload = {
    files: {
      [filename]: {
        content: JSON.stringify(data, null, 2)
      }
    }
  };

  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `token ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    res.status(200).json({ message: "Post added successfully!", gistUrl: result.html_url });
  } catch (error) {
    res.status(500).json({ message: "Error uploading post", error: error.message });
  }
}
