// Generate 6-digit ID
function generateId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Format price with Rs. and commas
function formatPrice(input) {
  let value = input.value.replace(/\D/g, "");
  if (value) {
    input.value = "Rs. " + Number(value).toLocaleString("en-LK");
  } else {
    input.value = "";
  }
}

// Preview images
document.getElementById("images").addEventListener("change", (e) => {
  const preview = document.getElementById("preview");
  preview.innerHTML = "";
  Array.from(e.target.files).slice(0, 4).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// Load saved data from localStorage
window.addEventListener("load", () => {
  document.getElementById("postId").value = generateId();

  const saved = JSON.parse(localStorage.getItem("uploaderData"));
  if (saved) {
    for (let key in saved) {
      if (document.getElementById(key)) {
        document.getElementById(key).value = saved[key];
      }
    }
  }
});

// Save to localStorage
function saveToLocal() {
  const fields = ["title", "price", "condition", "description", "name", "phone", "location"];
  let data = {};
  fields.forEach(f => {
    const el = document.getElementById(f);
    if (el) data[f] = el.value;
  });
  data.brand = document.getElementById("brand").checked;
  data.model = document.getElementById("model").checked;
  data.whatsapp = document.getElementById("whatsapp").checked;
  data.other = document.getElementById("other").checked;

  localStorage.setItem("uploaderData", JSON.stringify(data));
  alert("✅ Data saved locally!");
}

// Format price on blur
document.getElementById("price").addEventListener("blur", (e) => formatPrice(e.target));

// Submit handler (real API call again)
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const files = document.getElementById("images").files;
    const images = [];
    for (let file of Array.from(files).slice(0, 4)) {
      images.push(await compressImage(file));
    }

    const data = {
      id: document.getElementById("postId").value,
      title: document.getElementById("title").value,
      price: document.getElementById("price").value,
      condition: document.getElementById("condition").value,
      brand: document.getElementById("brand").checked,
      model: document.getElementById("model").checked,
      description: document.getElementById("description").value,
      name: document.getElementById("name").value,
      phone: "+94" + document.getElementById("phone").value,
      whatsapp: document.getElementById("whatsapp").checked,
      other: document.getElementById("other").checked,
      location: document.getElementById("location").value,
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

    // Generate a new ID for next submission
    document.getElementById("postId").value = generateId();

    // Reset form
    document.getElementById("uploadForm").reset();
    document.getElementById("preview").innerHTML = "";
  } catch (err) {
    console.error("Error:", err);
    alert("Error: " + err.message);
  }
});

// Compress images before upload (same as before)
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
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
