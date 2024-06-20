import express from "express"

const HOST = "0.0.0.0"
const PORT = 5000

const app = express()

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(PORT, HOST, () => {
    console.log(`Starting server in port: ${PORT} `)
})