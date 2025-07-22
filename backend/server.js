const express = require('express');
const cors = require('cors');
const suggestRoute = require('./routes/suggest');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/suggest', suggestRoute);

app.listen(5000, () => console.log('Backend running on port 5000'));
