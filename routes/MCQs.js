const db = require("../db");

const postMCQs = (req, res) => {
    const question = req.body.question;
    const options = {
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4,
    }
    const correctOption = req.body.correctOption;
    const chapterCode = req.params.chapterCode;
    try {
        const query = "INSERT INTO mcqs (question, option1, option2, option3, option4, correctOption, chapter_code) VALUES (?,?,?,?,?,?,?)";
        const queryArray = [question, options.option1, options.option2, options.option3, options.option4, correctOption, chapterCode];
        console.log(queryArray);
        db.query(query, queryArray, (err, result) => {
            if (err) {
                res.status(400).json({ Error: err })
            }
            res.status(200).json({ "Data Saved Successully": result })
        })
    } catch (err1) {
        res.status(500).json("Internal Server Error", err1)
    }

}

const getMCQs = (req, res)=>{
    const chapterCode = req.params.chapterCode;
    const query = "SELECT * FROM mcqs WHERE chapter_code = ?";
    try{
        db.query(query, chapterCode, (err, result)=>{
            if (err) {
                res.status(400).json({ Error: err })
            }
            res.status(200).json({data: result})
        })
    }catch(err){
        res.status(500).json("Internal Server Error", err)
    }
}

module.exports = {postMCQs, getMCQs}