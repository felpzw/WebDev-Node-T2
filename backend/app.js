const express = require("express");

app.use(express.json());
app.use(express.static(__dirname + "../frontend/public"));

app.use("/clientes", require("./rotas/clientes.js"));
app.use("/agendamentos", require("./rotas/agendamentos.js"));
app.use("/admin", require("./rotas/admin.js"));

app.listen(4000, function () {
  console.log("Servidor rodando..");
});
