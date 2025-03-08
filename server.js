const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./router/authRoutes');
const homeRoutes = require('./router/homeRoutes');
const userRoutes = require('./router/userRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});