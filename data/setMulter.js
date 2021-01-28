const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage');
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname);
    }

});

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

module.exports = upload;
