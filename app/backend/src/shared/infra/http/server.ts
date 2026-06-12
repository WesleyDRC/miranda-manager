import app from "@/shared/infra/http/app"

app.listen(parseInt(process.env.PORT), process.env.HOST, () => {
	console.log(`Starting server in port: ${process.env.PORT} `)
})