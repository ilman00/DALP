require('dotenv').config()
const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");


const {postSubject, getSubject} = require("./routes/subjectRout");
const {postChapter, getChapter} = require("./routes/chapterRout");
const {postContent, getContent} = require("./routes/contentRout");
const {postMCQs, getMCQs} = require("./routes/MCQs")
const {QAget, QApost} = require("./routes/qa")







const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const allowedOrigins = [
    'http://localhost:5173',                  // Local React app
    'https://e-digital-pakistan-project.vercel.app',
    'https://dalp.digipakistan.com/'  // Live React app
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

//  Retrieving Content Data from Database
app.get("/api/:chapterCode/content/data", getContent);
// Retrieving Exercise From database
app.get("/api/:chapterCode/exercise/data", getMCQs);
//Getting QA
app.get("/api/:chapterCode/qa/data", QAget);



// Save Subject in Database
app.post("/api/subject/data", upload.single("subject"), postSubject);

// saving chapter data in database
app.post("/api/:subCode/chapter/data", postChapter);

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 }, // Accept 1 image file
    { name: 'video', maxCount: 1 }  // Accept 1 video file
]);
// Saving Content Data in the database
app.post("/api/:chapterCode/content/data", uploadFields, postContent);

// Saving Exercise Data from Database
app.post("/api/:chapterCode/exercise/data", postMCQs);
// Saving QA
app.post("/api/:chapterCode/qa/data", QApost);






app.listen(3000, () => {
    console.log(`Server running on 3000`);
});