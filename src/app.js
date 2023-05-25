const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { autoIncrement } = require('mongoose-plugin-autoinc');

const app = express();
app.use(bodyParser.json());
const routers = require('./routes/index');
routers(app)

mongoose.connect('mongodb+srv://username:*****@cluster0.rmhnct4.mongodb.net/nodelab?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server started...');
    });
})
