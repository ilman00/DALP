const db = require("../db")


const QAget = async (req, res) => {
    try {

        const chapterCode = req.params.chapterCode;
        const query = "SELECT * FROM q_a WHERE chapter_code = ?";

        const [result] = await db.query(query, [chapterCode])

        if (!result) {
            return res.status(404).json({ Error: "Error Getting question Answer", result })
        }


        res.status(200).json({ data: result })

    } catch (err) {
        res.status(500).json("Internal Server Error: " + err);
    }
}

const QApost = async (req, res) => {
    try {

        const newQA = {
            chapterCode: req.params.chapterCode,
            question: req.body.question,
            answer: req.body.answer

        }

        const query = "INSERT INTO q_a (question, answer, chapter_code) VALUES (?,?,?)";

        const [result] = await db.query(query, [newQA.question, newQA.answer, newQA.chapterCode])
            if (!result) {
                return res.status(404).json({ Error: "Error inserting Questions or Answer" })
            }

            res.status(200).json({ data: result })

    } catch (err) {
        res.status(500).json("Internal Server Error: " + err);
    }
}

module.exports = { QAget, QApost }