const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 8000;

app.use(morgan('dev'));

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
