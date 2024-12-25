require('dotenv').config()
const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");


const {postSubject, getSubject} = require("./routes/subjectRout")
const {postChapter, getChapter} = require("./routes/chapterRout")









const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const allowedOrigins = [
    'http://localhost:5173',                  // Local React app
    'https://e-digital-pakistan-project.vercel.app',  // Live React app
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true); // Allow the request
            } else {
                callback(new Error('Not allowed by CORS')); // Reject the request
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Allow cookies and credentials
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Authorization'], // Expose necessary headers
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);






app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));








const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = file.mimetype.split('/')[0]; // Get the file type (image or video)
        let uploadPath;
        const routPath = req.route.path;

        if (fileType === 'image') {
            if (routPath.includes("content")) {
                uploadPath = "uploads/images/content/"
            } else if (routPath.includes("subject")) {

                uploadPath = 'uploads/images/subject/';
            }

        } else if (fileType === 'video') {
            uploadPath = 'uploads/videos/';
        } else {
            return cb(new Error('File type not supported'), false);
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        cb(null, uploadPath); // Directory where the images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with the current timestamp and original extension
    },
});

const upload = multer({ storage: storage });

// Retrieving subject from database
app.get("/api/:classNumber/subject/data", getSubject);

// Retrieving chapter from database
app.get("/api/:subjectCode/chapter/data", getChapter);

// Save Subject in Database
app.post("/api/subject/data", upload.single("subject"), postSubject);

// saving chapter data in database
app.post("/api/:subCode/chapter/data", postChapter);



app.listen(3000, () => {
    console.log(`Server running on 3000`);
});