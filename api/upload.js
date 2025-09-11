// Format price as Rs. xx,xxx
document.getElementById("price").addEventListener("input", function(e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value) {
    e.target.value = "Rs. " + Number(value).toLocaleString("en-LK");
  }
});

// Preview selected images (limit 4)
document.getElementById("images").addEventListener("change", function() {
  const preview = document.getElementById("preview");
  preview.innerHTML = "";
  const files = Array.from(this.files).slice(0,4); // limit 4
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
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
    location: document.getElementById("location").value
  };
  localStorage.setItem("draftForm", JSON.stringify(formData));
  alert("✅ Draft saved!");
});

// Load draft if exists
window.addEventListener("DOMContentLoaded", () => {
  const draft = localStorage.getItem("draftForm");
  if (draft) {
    const data = JSON.parse(draft);
    Object.keys(data).forEach(key => {
      if (document.getElementById(key)) {
        if (typeof data[key] === "boolean") {
          document.getElementById(key).checked = data[key];
        } else {
          document.getElementById(key).value = data[key];
        }
      }
    });
  }
});
