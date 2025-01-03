const { Query } = require("mysql2/typings/mysql/lib/protocol/sequences/Query");
const db = require("../db");

const getWordMeaning = async (req, res) => {
    try {
        const chapterCode = req.params.chapterId;
        const query = "SELECT * FROM word_meaning WHERE chapter_code = ?"

        const result = await db.query(query, [chapterCode])

        if (!result) {
            return res.status(404).json({ Error: "Error Getting Data from Database" })
        }

        res.json({ data: wordMeaningData });
    } catch (err) {
        res.status(500).json({ Error: "An Error occurred" })
    }
}

const postWordMeaning = async (req, res) => {
    try {
        const chapterCode = req.params.chapterCode;
        const query = "INSERT INTO word_meaning (word, meaning, chapterCode) VALUES (?,?,?)"
        const [result] = await db.query(query, [chapterCode])
        res.status(201).json({ message: "Data saved successfully", result });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = { getWordMeaning, postWordMeaning }