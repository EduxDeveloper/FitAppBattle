import mongoose from "mongoose";

const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/fitAppDB";
mongoose.connect(DB_URI);

//Comprobar que todo funciona

//Creo una constante que es igual a la conexión
const connection = mongoose.connection;

connection.once("open", () => {
    console.log("DB is connected")
})

connection.on("disconnected", () => {
    console.log("DB is disconnected")
})

connection.on("error", (error) => {
    console.log("Error found" + error)
})

