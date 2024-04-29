require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user.js');

const server = express();

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Database connected');
}

server.use(express.json());
server.use(cookieParser());
server.use('/api', userRoute);

server.listen(process.env.PORT, () => {
    console.log('Server running');
});