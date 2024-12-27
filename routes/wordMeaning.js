const { query } = require("express");
const db = require("../db");

const getWordMeaning = async (req, res)=>{
    try{
        const chapterCode = req.params.chapterId;
        const query = "SELECT 8 FROM word_meaning WHERE chapter_code"
       
        res.json({data: wordMeaningData});
    }catch(err){
        res.status(500).json({Error: "An Error occurred"})
    }
}

const postWordMeaning =  async (req, res) => {
    try {
        const chapterCode = req.params.chapterCode;

       
        res.status(201).json({ message: "Data saved successfully", wordMeaning: savedWordMeaning });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = {getWordMeaning, postWordMeaning}