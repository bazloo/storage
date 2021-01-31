const express = require('express');
const zlib = require('zlib');
const bodyParser = require('body-parser');
const fs = require('fs');
const data = require('../data/data');


let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router
    .route('/download')
    .post((req, res) => {

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
router
    .route('/download/:file')
    .get((req, res) => {
        res.download('./storage/' + req.params.file, () => {
            fs.unlinkSync('./storage/' + req.params.file)
        });
    });



module.exports = router;