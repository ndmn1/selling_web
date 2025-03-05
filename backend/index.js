import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import shopRoutes from './routes/shop.js';
import adminRoutes from './routes/admin.js';
const app = express();


// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use('/shop',shopRoutes);
app.use('/admin', adminRoutes);
mongoose.connect('mongodb+srv://ndminhnhat1234:IPBSZslrk9dVhqjs@cluster0.cpgs4.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
  .then((res) => {
    console.log('Connected to MongoDB');
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });