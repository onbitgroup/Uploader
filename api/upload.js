// api/upload.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      id,
      title,
      price,
      condition,
      description,
      name,
      phone,
      whatsapp,
      other,
      location,
      images,
    } = req.body;

    // ---- Basic validation ----
    if (!id || !title || !price) {
      return res.status(400).json({ message: "Missing required fields: id, title, or price" });
    }
    if (!images || images.length < 1 || images.length > 4) {
      return res.status(400).json({ message: "You must upload between 1 and 4 images" });
    }

    const filename = `post-${id}.json`;

    // ---- Env check ----
    const gistId = process.env.GIST_ID;
    if (!gistId) {
      return res.status(500).json({ message: "Missing GIST_ID in environment variables" });
    }
    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({ message: "Missing GITHUB_TOKEN in environment variables" });
    }

    // ---- Build data object ----
    const data = {
      id,
      title,
      price,
      condition: condition || "UNKNOWN",
      description: description || "",
      name: name || "",
      phone: phone || "",
      whatsapp: Boolean(whatsapp),
      other: Boolean(other),
      location: location || "",
      images,
      createdAt: new Date().toISOString(),
    };

    const payload = {
      files: {
        [filename]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    };

    // ---- Save to GitHub Gist ----
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: "GitHub API error", error: result });
    }

    return res.status(200).json({
      message: "Post added successfully!",
      gistUrl: result.html_url,
      postId: id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
