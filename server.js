// Small Express server that delivers the grade calculator (folder "public").
// The calculation itself runs in the browser – no grades are sent to the server.
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Grade calculator running on http://localhost:${port}`);
});

module.exports = app;
