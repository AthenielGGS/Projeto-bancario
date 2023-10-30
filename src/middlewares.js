const senhaInformadaBody = (req, res, next) => {
  const { senha } = req.body;
  if (!senha) {
    return res.status(400).json({
      mensagem: "O campo de senha é obrigatório",
    });
  }
  next()
};

const validarSenhabody = (req, res, next) => {
  const { senha } = req.body;
  if (senha !== contaEncontrada.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta" });
  }
  next();
};

const numeroConta = (req, res, next) => {
  const numero_conta = req.body;
  if (!numero_conta) {
    return res.status(400).json({
      mensagem: "O campo de numero de conta é obrigatório",
    });
  }
  next();
};

const valorInformado = (req, res, next) => {
  const valor = req.body;
  if (!valor) {
    return res.status(400).json({
      mensagem: "O campo de valor é obrigátorio",
    });
  }
};

// const  = (req, res, next) => {}
// const  = (req, res, next) => {}

// const  = (req, res, next) => {}

module.exports = {
  senhaInformadaBody,
  validarSenhabody,
  numeroConta,
  valorInformado,
};
