import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8080;

const app = express();

// Serve static files from the Angular dist directory
app.use(express.static(path.join(__dirname, 'dist/quiz/browser')));

// For all GET requests, send back Angular's index.html file
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/quiz/browser/index.html'));
});

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// Start the server on port 8080 or environment port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
