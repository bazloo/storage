
const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const zlib = require('zlib');
const fs = require('fs');
const bodyParser = require('body-parser');
const data = require('./data/data');
const storage = require('./data/setMulter');
const alert = require('alert');

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {

        if (!file.originalname.match(/\.(pdf|doc|png)$/)) {
            return cb(new Error('Only .pdf, .doc, .png are allowed.'), false);
        }
        cb(null, true);
    }
});

const app = express();
app.use(express.static('public'));
app.use(bodyParser());


app.post('/upload', upload.single('uploader'), (req, res, next) => {
    next();
});
app.use('/upload', (req, res,) => {

    const gzip = zlib.createGzip();
    let input = fs.createReadStream('./storage/' + req.file.filename);
    let key = uuid();
    let output = fs.createWriteStream('./storage/' + key + '.zip');
    input.pipe(gzip).pipe(output);
    let fileType = req.file.filename.split('.').slice(1);
    data[key] = { name: req.file.filename, type: fileType.toString() };
    fs.unlinkSync('./storage/' + req.file.filename);
    console.log(data);
    return alert('Your key to accses the file is: ' + '\n\n' + key);

});
app.post('/download', (req, res) => {

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