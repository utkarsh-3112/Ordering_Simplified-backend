require('dotenv').config();   // automatically loads environment variables from a.enc files into the process
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');  // supports secure cross-origin requests and data transfers between browsers and servers
const userRouter = require('./router/userRouter');
const orderRouter = require('./router/orderRouter');
const productRouter = require('./router/productRouter');
const cartRouter = require('./router/cartRouter');
const fileUpload = require('express-fileupload');
const db = require('./db.js');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('Database connected successfully');
})

// Routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);
const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
  console.log('started');
});
