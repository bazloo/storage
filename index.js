
const express = require('express');
const uploadRouter = require('./routes/uploadRouter');
const bodyParser = require('body-parser');
const zlib = require('zlib');
const fs = require('fs');
const data = require('./data/data');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/upload', uploadRouter);

//запросы по '/download' пока оставляю здесь, так как возникла ошибка 
//при переносе в отдельный route

app.post('/download',(req, res) => {

    file = req.body.fileToDownload;
    if (!data[file]) {
        return res.send("No such file in database, please try another one")
    }
    else {
        const unzip = zlib.createGunzip();
        let input = fs.createReadStream('./storage/' + file + '.zip');
        let output = fs.createWriteStream('./storage/' + data[file].name);
        input.pipe(unzip).pipe(output);
        res.redirect('/download/' + `${data[file].name}`);
    }
});
app.get('/download/:file', (req, res) => {
res.download(__dirname + '/storage/' + req.params.file, () => {
    fs.unlinkSync('./storage/' + req.params.file)
});
});

app.listen(3000, () => console.log('server has been started'));