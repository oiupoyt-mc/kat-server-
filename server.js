const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Middleware
app.use(express.static(__dirname)); // serve index.html
app.use('/uploads', express.static(uploadDir));

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded!');
});

// List files
app.get('/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).send('Error reading files');
    res.json(files);
  });
});

// Delete file
app.delete('/delete/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  fs.unlink(filePath, err => {
    if (err) return res.status(500).send('Error deleting file');
    res.send('File deleted');
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
