<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Product Uploader</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .form-group { margin-bottom: 12px; }
    label { display: block; margin-bottom: 4px; }
    input, textarea, button { width: 100%; padding: 8px; }
    .preview img { max-width: 120px; margin-right: 8px; margin-top: 8px; }
  </style>
</head>
<body>
  <h2>Upload Product</h2>
  <div class="form-group">
  <label>Post ID:</label>
  <input type="text" id="postId" readonly>
  </div>

  <form id="uploadForm">
    <div class="form-group">
      <label>Product Title:</label>
      <input type="text" id="title" required>
    </div>
    <div class="form-group">
      <label>Upload Images (3-4):</label>
      <input type="file" id="images" accept="image/*" multiple required>
      <div class="preview" id="preview"></div>
    </div>
    <div class="form-group">
      <label>Price:</label>
      <input type="number" id="price">
    </div>
    <div class="form-group">
      <label>Description:</label>
      <textarea id="description"></textarea>
    </div>
    <div class="form-group">
      <label>Your Name:</label>
      <input type="text" id="name">
    </div>
    <div class="form-group">
      <label>Phone:</label>
      <input type="text" id="phone">
    </div>
    <button type="submit">Submit</button>
  </form>
<script src="JS/script.js"></script>
</body>
</html>


