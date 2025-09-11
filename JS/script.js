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

// ---------- FORM BEHAVIOUR ----------

// Format price as Rs. xx,xxx
document.getElementById("price").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value) {
    e.target.value = "Rs. " + Number(value).toLocaleString("en-LK");
  }
});

// Preview selected images (limit 4)
document.getElementById("images").addEventListener("change", function () {
  const preview = document.getElementById("preview");
  preview.innerHTML = "";
  const files = Array.from(this.files).slice(0, 4); // limit 4
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// Save draft in localStorage
document.getElementById("saveDraft").addEventListener("click", () => {
  const formData = {
    id: document.getElementById("postId").value,
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    condition: document.getElementById("condition").value,
    description: document.getElementById("description").value,
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    whatsapp: document.getElementById("whatsapp").checked,
    other: document.getElementById("other").checked,
    location: document.getElementById("location").value,
  };
  localStorage.setItem("draftForm", JSON.stringify(formData));
  alert("✅ Draft saved!");
});

// Load draft OR generate ID
window.addEventListener("DOMContentLoaded", () => {
  const draft = localStorage.getItem("draftForm");

  if (draft) {
    const data = JSON.parse(draft);
    Object.keys(data).forEach((key) => {
      if (document.getElementById(key)) {
        if (typeof data[key] === "boolean") {
          document.getElementById(key).checked = data[key];
        } else {
          document.getElementById(key).value = data[key];
        }
      }
    });
  } else {
    // No draft → generate new Post ID
    document.getElementById("postId").value = generateId();
  }
});

// ---------- SUBMIT ----------

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const files = document.getElementById("images").files;
    if (files.length < 1 || files.length > 4) {
      alert("Please upload between 1 and 4 images.");
      return;
    }

    const images = [];
    for (let file of files) {
      const compressed = await compressImage(file);
      images.push(compressed);
    }

    const data = {
      id: document.getElementById("postId").value,
      title: document.getElementById("title").value,
      price: document.getElementById("price").value,
      condition: document.getElementById("condition").value,
      description: document.getElementById("description").value,
      name: document.getElementById("name").value,
      phone: "+94" + document.getElementById("phone").value,
      whatsapp: document.getElementById("whatsapp").checked,
      other: document.getElementById("other").checked,
      location: document.getElementById("location").value,
      images: images,
      createdAt: new Date().toISOString(),
    };

    console.log("Sending data:", data);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Upload failed:", errText);
      alert("Upload failed: " + errText);
      return;
    }

    const result = await res.json();
    console.log("Upload success:", result);
    alert(
      "✅ Post uploaded!\nYour Post ID: " +
        data.id +
        "\nView gist: " +
        result.gistUrl
    );

    // Generate a new ID for the next submission
    document.getElementById("postId").value = generateId();

    // Clear draft + reset form
    localStorage.removeItem("draftForm");
    document.getElementById("uploadForm").reset();
    document.getElementById("preview").innerHTML = "";
  } catch (err) {
    console.error("Error:", err);
    alert("Error: " + err.message);
  }
});
