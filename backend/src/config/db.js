const mongoose = require("mongoose");

const dbUser = "root";
const dbPass = "root";
const dbName = "SlideProject";


mongoose
  .connect(`mongodb://${dbUser}:${dbPass}@localhost:27017/${dbName}?authSource=admin`, {})
  .then(() => console.log("Conectado ao MongoDB:SlideProject"))
  .catch((err) => console.error("Erro ao conectar:", err));

module.exports = mongoose;