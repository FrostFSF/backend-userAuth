import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const server = express()
const PORT = process.env.PORT

server.post("/signup", (req,res) => {
    return res.json({ "route": req.url, "msg": "was hit." })
})

server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})
