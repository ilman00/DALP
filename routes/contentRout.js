const db = require("../db");

const postContent = async (req, res) => {
    const chapterCode = req.params.chapterCode;
    const text = req.body.text;
    const image = req.files.image ? req.files.image[0].path : null;
    const video = req.files.video ? req.files.video[0].path : null;


    const query = "INSERT INTO content (text, img, video, chapter_code) VALUES (?,?,?,?)";

    const [result] = await db.query(query, [text, image, video, chapterCode])

        if (!result) {
            return res.status(404).json({ Error: "Error Inserting" });
        }

        res.status(200).json({ data: result })
}

const getContent = async (req, res) => {
    const chapterCode = req.params.chapterCode
    try {
        const query = "SELECT * FROM content WHERE chapter_code = ? ";

        const [result] = await db.query(query, [chapterCode]);

        if(!result){
            return res.status(404).json({Error: "Error Retrieving Data"})
        }   

        res.json({ data: result })
    } catch (err1) {
        res.status(400).json({ error: err1.message });
    }

}




module.exports = { postContent, getContent }