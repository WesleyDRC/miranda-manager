import app from "./app"

const HOST = "0.0.0.0"
const PORT = 5000

app.listen(PORT, HOST, () => {
	console.log(`Starting server in port: ${PORT} `)
})