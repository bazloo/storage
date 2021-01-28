const express = require('express');
const zlib = require('zlib');
const upload = require('../data/setMulter');
const fs = require('fs');
const uuid = require('uuid').v4;
const data = require('../data/data');
const alert = require('alert');

let router = express.Router();

router
    .route('/')
    .post(upload.single('uploader'), (req, res, next) => {
        next();
    });

router.use((req, res,) => {

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

module.exports = router;