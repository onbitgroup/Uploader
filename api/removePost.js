export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: "Missing fileName" });
    }

    const gistId = process.env.GIST_ID;
    const token = process.env.GITHUB_TOKEN;

    if (!gistId || !token) {
      return res.status(500).json({ message: "Missing GIST_ID or GITHUB_TOKEN" });
    }

    // GitHub Gist API expects null to delete a file
    const payload = {
      files: {
        [fileName]: null
      }
    };

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: "GitHub API error", error: result });
    }

    return res.status(200).json({ message: "Post removed successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
