const { query } = require("express");
const db = require("../db")

const postSubject = (req, res) => {
    const subPic = req.file ? req.file.path : null; // Handle file upload path
    const newSubject = [
        req.body.title,
        req.body.class,
        req.body.code,
        subPic,
    ];

    try {
        const query = "INSERT INTO subjects (title, class, code, subPic) VALUES (?,?,?,?);";
        db.query(query, newSubject, (err, result)=>{
            if(err){
                return res.status(404).json({Error: err})
            }
            const insertSubjectData = {
                id: result.insertId, // Auto-generated ID
                title: req.body.title,
                class: req.body.class,
                code: req.body.code,
                subPic,
            };
    
            res.status(201).json({result: insertSubjectData});
        })

    } catch (err) {
        console.error("Error inserting subject:", err.message);
        res.status(400).json({ error: err.message }); // Send error response
    }
};

const getSubject = (req, res)=>{
    const classNumber = req.params.classNumber;
    const query = "SELECT * FROM subjects WHERE class = ?"
    db.query(query, [classNumber],(err, result)=>{
        if(err){
            return res.status(404).json({Error: err})
        }

        res.status(200).json({data: result})
    })
}


module.exports = {postSubject, getSubject}