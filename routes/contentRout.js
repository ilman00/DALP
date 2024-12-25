const db = require("../db");

const postContent = (req, res)=>{
    const text = req.body.text;
    const image = req.file.image ? req.file.image[0].path : null;
    const video = req.file.video ? req.file.video[0].path : null;

    const query = "INSERT INTO content (text, img, video) VALUES (?,?,?)"
    db.query(query, [text, image, video], (err, result)=>{
        if(err){
            return res.status(404).json({Error: err});
        }

        res.status(200).json({data: data})

    } )

}

module.exports = {postContent}