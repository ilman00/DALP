const db = require("../db");

const postContent = (req, res)=>{
    const chapterCode = req.params.chapterCode;
    const text = req.body.text;
    const image = req.files.image ? req.files.image[0].path : null;
    const video = req.files.video ? req.files.video[0].path : null;

    const query = "INSERT INTO content (text, img, video, chapter_code) VALUES (?,?,?,?)";
    db.query(query, [text, image, video, chapterCode], (err, result)=>{
        if(err){
            return res.status(404).json({Error: err});
        }

        res.status(200).json({data: result})

    } )

}

const getContent = (req, res)=>{
    const chapterCode = req.params.chapterCode
    const query = "SELECT * FROM content WHERE chapter_code = ? ";
    console.log("Received chapterCode:", chapterCode);
    console.log("Request Body", req.body);
    try{
        db.query(query, [chapterCode], (err, result)=>{
            if(err){
                return res.status(404).json({Error: err});
            }
    
            res.json({data: result})
        })
    }catch(err1){
        res.status(400).json({ error: err1.message });
    }
   
}




module.exports = {postContent, getContent}