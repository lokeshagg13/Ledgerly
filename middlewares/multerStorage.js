const fs = require('fs');
const multer = require('multer');

const UPLOAD_DIR = 'uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);   // Files will be saved in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

if (!fs.existsSync(UPLOAD_DIR))
    fs.mkdirSync(UPLOAD_DIR);

const upload = multer({ storage: storage });

module.exports = upload;