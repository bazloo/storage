
const express = require('express');
const uploadRouter = require('./routes/uploadRouter');
const downloadRouter = require('./routes/downloadRouter');
const bodyParser = require('body-parser');


const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/upload', uploadRouter);
app.use('/', downloadRouter);


app.listen(3000, () => console.log('server has been started'));