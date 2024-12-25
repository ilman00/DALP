const { query } = require("express");
const db = require("../db");

const postChapter = (req, res) => {

    const subCode = req.params.subCode;
    const name = req.body.chapName;
    const chapterCode = req.body.chapterCode;

    try{
        const query = "INSERT INTO chapters (name, chapter_code, subject_code) VALUES (?,?,?)";
        db.query(query, [name, chapterCode, subCode], (err, result)=>{
            if(err){
                return res.status(404).json({Error: err})
            }
            res.json({data: result})
        })

    } catch(err){
        return res.status(500).json({Error: err})
    }

}


const getChapter = (req, res) => {
    const subCode = req.params.subjectCode;

    try {
        const query = "SELECT * FROM chapters WHERE subject_code = ?";

        db.query(query, [subCode], (err, result) => {
            if (err) {
                return res.status(404).json(err);
            }
            res.json(result);
        });
    } catch (err) {
        res.status(500).json(err);
    }
};



module.exports = {postChapter, getChapter}