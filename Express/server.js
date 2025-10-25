const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, 'public/images')
    },
    filename: (req, file, cd) => {
        cd(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "brofie"
})

app.post('/user', (req, res) => {
    user = req.body.user;

    return res.json({Status: 'Success', data: user})
})

app.get('/images', (req, res) => {
    db.query("SELECT * FROM images", (err, data) => {
        if (err) return res.json(err);

        return res.json(data);
    })
})

app.post('/upload', upload.single('image'), (req, res) => {
    const image = req.file.filename;
 
    db.query("INSERT INTO images (Image, username, date) VALUES (?, ?)", [image, req.body.user, req.body.date], (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }

        return res.json({Status: 'Success', data: image})
    })
})

app.listen(8081, ()=>{
    console.log("Express server listening on port 8081");
})