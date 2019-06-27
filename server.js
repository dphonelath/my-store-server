const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const PORT = process.env.PORT || 4000;

const app = express();

// Middleware

app.use(cors());
app.use(morgan('dev'));

// Router files

// Routes
// eslint-disable-next-line
app.get('/api/test', (req, res, next) => {
    res.json({
        message: 'Route working'
    });
});

// Error handling

// The following 2 `app.use`'s MUST follow ALL your routes/middleware
app.use(notFound);
app.use(errorHandler);

// eslint-disable-next-line
function notFound(req, res, next) {
    res.status(404).send({error: 'Not found!', status: 404, url: req.originalUrl});
}

// eslint-disable-next-line
function errorHandler(err, req, res, next) {
    console.error('ERROR', err);
    const stack =  process.env.NODE_ENV !== 'production' ? err.stack : undefined;
    res.status(500).send({error: err.message, stack, url: req.originalUrl});
}

// Listener

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});