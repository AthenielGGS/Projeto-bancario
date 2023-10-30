const app = require("./servidor");
const rotas = require("./rotas");

app.use(rotas);

app.listen(3000, () => {
  console.log("API rodando no porta 3000");
})
