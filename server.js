const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// eslint-disable-next-line
const PORT = process.env.PORT || 4000;

const app = express();

// Middleware

app.use(cors());
app.use(morgan('dev'));

//sequelize models
const db = require('./models');
const Category = db.Category;
const Product = db.Product;

// Router files

// Routes
// eslint-disable-next-line
app.get('/api/categories', (req, res, next) => {
    Category.findAll({
        include:[{ model: Product }]
    })
        .then(categories => {
            res.json({
                categories
            });
        })
        .catch(error => {
            next(error);
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
    // eslint-disable-next-line
    const stack =  process.env.NODE_ENV !== 'production' ? err.stack : undefined;
    res.status(500).send({error: err.message, stack, url: req.originalUrl});
}

// Listener

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});