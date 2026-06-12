import app from "./app.js";
import "./database.js"

//Creo una función para ejecutar
//el servidor
async function main() {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT);
    console.log(`Server on port ${PORT}`);
}

main()