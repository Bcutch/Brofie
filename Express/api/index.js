const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

const S3Cl = require('@aws-sdk/client-s3')
const presigner = require('@aws-sdk/s3-request-presigner')
const dotenv = require('dotenv')
const pg = require('pg')

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const pghost = process.env.PGHOST
const pgdatabase = process.env.PGDATABASE
const pguser = process.env.PGUSER
const pgpassword = process.env.PGPASSWORD
const pgsslmode = process.env.PGSSLMODE
const pgchannelbinding = process.env.PGCHANNELBINDING

const s3 = new S3Cl.S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

const storage = multer.memoryStorage()

const upload = multer({
    storage: storage
})

const db = new pg.Client({
    host: pghost,
    user: pguser,
    password: pgpassword,
    database: pgdatabase
})

db.connect()
    .then(
        console.log('DB connected')
    ).catch((err)=>{
        console.log('ERROR: DB failed to connected')
        console.log(err)
    })

function query(sql, dostuff) {
    db.query(sql, async (err,res)=>{
        if (err) {
            console.log('Query: ' + sql + 'FAILED')
            console.log(err)
            await dostuff(null)
        } else {
            await dostuff(res)
        }
    })
}

app.post('/user', (req, res) => {
    user = req.body.user;

    return res.json({Status: 'Success', data: user})
})

app.get('/', (req, res) => {
    
    res.send('Server Successfully running')
});

app.get('/images', async (req, res) => {
    query("SELECT * FROM images", async (results) => {
        if (!results) return res.json({});

        console.log(results.rows)

        const ret = []

        for (let i = 0; i < results.rowCount; i++) {

            const row = results.rows[i]

            const params = {
                Bucket: bucketName,
                Key: row.image,
            }

            const url = await presigner.getSignedUrl(s3, new S3Cl.GetObjectCommand(params), { expiresIn: 3600 })

            ret.push({
                id: row.id,
                image: row.image,
                date: row.imagedate,
                user: row.username,
                imageUrl: url 
            }) 
        }

        return res.json({images: ret})
    })
})

app.post('/upload', upload.single('image'), async (req, res) => {

    console.log("req.body", req.body)
    console.log("req.file", req.file)

    const name = req.file.fieldname + "_" + Date.now() + path.extname(req.file.originalname)

    const params = {
        Bucket: bucketName,
        Key: name,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }

    await s3.send(new S3Cl.PutObjectCommand(params))

    const sql = "INSERT INTO images (image, username, imagedate) VALUES ('" + name + "','" + req.body.user + "','" + req.body.date + "')"

    await db.query(sql, (err,res)=>{
        if (err) {
            console.log('Query: ' + sql + 'FAILED')
            console.log(err)
            return res.json({})
        } else {
            return res.json({Status: 'Success', data: req.file.filename})
        }
    })

})

app.listen(8081, ()=>{
    console.log("Express server listening on port 8081");
})
