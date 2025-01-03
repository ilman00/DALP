const db = require("../db");

const postMCQs = async (req, res) => {
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

        const [result] = await db.query(query, queryArray);
            if (!result) {
                res.status(400).json({ Error: "Error Inserting MSQ"})
            }
            res.status(200).json({ "Data Saved Successully": result })
    } catch (err) {
        res.status(500).json("Internal Server Error", err)
    }

}

const getMCQs = async (req, res)=>{
    const chapterCode = req.params.chapterCode;
    
    
    try{
        const query = "SELECT * FROM mcqs WHERE chapter_code = ?";
        const [result] = await db.query(query, [chapterCode]);
            if (!result) {
                res.status(400).json({ Error: "Error Getting MCQS from database" })
            }
            res.status(200).json({data: result})
    }catch(err){
        res.status(500).json("Internal Server Error", err)
    }
}

module.exports = {postMCQs, getMCQs}