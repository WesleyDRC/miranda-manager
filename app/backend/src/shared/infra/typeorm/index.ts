import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    username: "root",
    password: "example"
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })