const db = require("../db");

const postChapter = async (req, res) => {

    const subCode = req.params.subCode;
    const name = req.body.chapName;
    const chapterCode = req.body.chapterCode;

    try{
        const query = "INSERT INTO chapters (name, chapter_code, subject_code) VALUES (?,?,?)";

        const [result] = await db.query(query, [name, chapterCode, subCode]);

        if(!result){
            return res.status(404).json({Error: "Error inserting data" , result})

        }

        res.status(200).json({data: result})

    } catch(err){
        return res.status(500).json({Error: err})
    }

}


const getChapter = async (req, res) => {
    const subCode = req.params.subjectCode;

    try {
        const query = "SELECT * FROM chapters WHERE subject_code = ?";
        
        // Use the promise-based query method
        const [result] = await db.query(query, [subCode]);

        if(!result){
            return res.status(404).json({Error: "Error retureiving data" , result})
        }
        
        // Respond with the query result
        res.json({data: result});
    } catch (err) {
        // Handle database errors or unexpected issues
        if (err.code === 'ER_NO_SUCH_TABLE') {
            res.status(404).json({ message: "No chapters found for the given subject code." });
        } else {
            res.status(500).json({ message: "Internal server error", error: err.message });
        }
    }
};



module.exports = {postChapter, getChapter}