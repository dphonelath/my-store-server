require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// eslint-disable-next-line
const PORT = process.env.PORT || 4000;

const app = express();

// Middleware

app.use(cors());
app.use(morgan('dev'));
app.use(express.json())

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

app.get('/api/products', (req, res, next) =>{
    Product.findAll({
        include: [{ model:Category }]
    })
        .then(products => {
            res.json({
                products
            });
        })
        .catch(error => {
            next(error);
        });
});

// eslint-disable-next-line
app.get('/api/products/:id', (req, res, next) => {
    const id = req.params.id;

    Product.findByPk(id, {
        include: [{ model: Category }]
    })
        .then (product => {
            res.json({ product });
        })
        .catch(error => {
            console.log(error);
        });
});

app.post('/api/checkout', async (req, res, next) => {
    const lineItem = req.body;
    const lineItems = [lineItem];

    try {
        //Create session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel'
        });
        //send session to client
        res.json({ session });
    }
    catch (error) {
        next({ error });
    }
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