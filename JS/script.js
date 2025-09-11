// Generate 6-digit ID
function generateId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Resize + compress image before upload
function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = maxWidth / img.width;
        const width = img.width > maxWidth ? maxWidth : img.width;
        const height = img.width > maxWidth ? img.height * scale : img.height;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality)); // compressed Base64
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Set the ID when page loads
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("postId").value = generateId();
});

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const files = document.getElementById("images").files;
    const images = [];
    for (let file of files) {
      const compressed = await compressImage(file);
      images.push(compressed);
    }

    const data = {
      id: document.getElementById("postId").value,
      title: document.getElementById("title").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      images: images,
      createdAt: new Date().toISOString()
    };

    console.log("Sending data:", data);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Upload failed:", errText);
      alert("Upload failed: " + errText);
      return;
    }

    const result = await res.json();
    console.log("Upload success:", result);
    alert("✅ Post uploaded!\nYour Post ID: " + data.id + "\nView gist: " + result.gistUrl);

    // Generate a new ID for the next submission
    document.getElementById("postId").value = generateId();

    // Reset form
    document.getElementById("uploadForm").reset();
  } catch (err) {
    console.error("Error:", err);
    alert("Error: " + err.message);
  }
});
