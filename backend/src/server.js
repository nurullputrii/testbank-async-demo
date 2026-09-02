import { createApp } from './app.js';

const PORT = process.env.PORT || 3001;

createApp().listen(PORT, () => {
  console.log(`[testbank] API listening on http://localhost:${PORT}`);
});
