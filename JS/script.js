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
  localStorage.setItem("uploaderData", JSON.stringify(data));
  alert("✅ Data saved locally!");
}

// Format price on blur
document.getElementById("price").addEventListener("blur", (e) => formatPrice(e.target));

// Submit handler (your original code continues here…)
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  alert("Submitting... (you can connect this to your API as before)");
});
