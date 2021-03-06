const express = require('express');
const morgan = require('morgan');
const MOVIEDEX = require('./MOVIEDEX.json')
require('dotenv').config()
const cors = require('cors');
const helmet = require('helmet')

const app = express();
const PORT = process.env.PORT || 8000;
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);
app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

function validateBearerToken(req,res,next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    if(!authToken || authToken.split(" ")[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request'})
    }

    next();
}

app.get('/movie', (req,res) => {
    let response = MOVIEDEX;

    if(req.query.genre) {
        response = response.filter(movie => {
            return movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        })
    }

    if(req.query.country) {
        response = response.filter(movie => {
            return movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        })
    }

    if(req.query.avg_vote) {
        response = response.filter(movie => {
            return movie.avg_vote >= req.query.avg_vote
        })
    }

    res.json(response)
})

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
