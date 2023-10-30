const express = require("express");
const banco = require("./controladores/banco");
const {
  senhaInformadaBody,
  validarSenhabody,
  numeroConta,
  valorInformado,
} = require("./middlewares");
const rotas = express()

rotas.get("/contas", banco.listarContas);
rotas.post("/criarconta", banco.criarConta);
rotas.put("/contas/:numero/usuario", banco.atualizarUsuarioDaConta);
rotas.delete("/contas/:numero", banco.excluirConta);
rotas.post(
  "/transacoes/depositar",
  numeroConta,
  valorInformado,
  banco.depositar
);
rotas.post(
  "/transacoes/sacar",
  senhaInformadaBody,
  validarSenhabody,
  numeroConta,
  valorInformado,
  banco.sacar
);
rotas.post(
  "/transacoes/transferir",
  valorInformado,
  senhaInformadaBody,
  banco.transferir
);
rotas.get("/contas/saldo", banco.consultarSaldo);
rotas.get("/contas/extrato", banco.consultarExtrato);

module.exports = rotas;
