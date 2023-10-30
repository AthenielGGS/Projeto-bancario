const bancoDeDados = require("../bancodedados");
let { contas } = require("../bancodedados");

const listarContas = (req, res) => {
  const { senha_banco } = req.query
  if (!senha_banco) {
    return res.status(400).json({
      mensagem: "O campo de senha é obrigatório",
    })
  }
  if (senha_banco !== bancoDeDados.banco.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta" })
  }
  res.status(200).json(bancoDeDados.contas)
}

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, e_mail, senha } = req.body

  if (!nome || !cpf || !data_nascimento || !telefone || !e_mail || !senha) {
    return res.status(400).json({
      mensagem:
        "o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido",
    })
  }
  const cpfEncontrado = bancoDeDados.contas.find(
    (conta) => conta.usuario.cpf === cpf
  )
  if (cpfEncontrado) {
    return res.status(400).json({
      mensagem: "Esse CPF já está cadastrado",
    })
  }

  const emailEncontrado = bancoDeDados.contas.find(
    (conta) => conta.usuario.e_mail === e_mail
  );
  if (emailEncontrado) {
    return res.status(400).json({
      mensagem: "Esse e-mail já está cadastrado",
    });
  }
  const novoNumeroDaConta = bancoDeDados.contas.length + 1;
  const contaCriada = {
    numero: novoNumeroDaConta,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      e_mail,
      senha,
    },
  };
  bancoDeDados.contas.push(contaCriada);
  return res.status(201).json(contaCriada);
};

const atualizarUsuarioDaConta = (req, res) => {
  const { numero } = req.params;
  const { nome, cpf, data_nascimento, telefone, e_mail, senha } = req.body;

  const contaEncontrada = contas.find((conta) => {
    return conta.numero === Number(numero);
  });
  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "Conta não encontrada." });
  }
  contaEncontrada.usuario = {
    nome: nome || contaEncontrada.usuario.nome,
    cpf: cpf || contaEncontrada.usuario.cpf,
    data_nascimento: data_nascimento || contaEncontrada.usuario.data_nascimento,
    telefone: telefone || contaEncontrada.usuario.telefone,
    e_mail: e_mail || contaEncontrada.usuario.e_mail,
    senha: senha || contaEncontrada.usuario.senha,
  };
  res.status(201).json({ mensagem: "Conta atualizada com sucesso" });
};

const excluirConta = (req, res) => {
  const { numero } = req.params;

  const contaEncontrada = contas.find((contas) => {
    return contas.numero === contas.numero;
  });
  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "Conta não encontrada." });
  }

  if (contaEncontrada.saldo !== 0) {
    return res.status(404).json({
      mensagem: "O saldo da conta está positivo e não pode ser excluída",
    });
  }

  bancoDeDados.contas = bancoDeDados.contas.filter((conta) => {
    return conta.numero !== Number(numero);
  });
  res.status(201).json({ mensagem: "Conta excluída com sucesso" });
};

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  const contaEncontrada = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(numero_conta)
  );
  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "Essa conta não existe" });
  }

  if (valor === 0 || valor === -1) {
    return res
      .status(404)
      .json({ mensagem: "Não é possivel realizar o deposito" });
  }

  contaEncontrada.saldo += valor;
  const dataAtual = new Date();
  const registroDeposito = {
    data: dataAtual,
    numero_conta: numero_conta,
    valor: valor,
  };
  bancoDeDados.depositos.push(registroDeposito);

  return res.status(200).json({ mensagem: "Depósito realizado com sucesso" });
};

const sacar = (req, res) => {
  const { numero_conta, valor } = req.body;

  const contaEncontrada = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(numero_conta)
  );
  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "Essa conta não existe" });
  }

  if (valor > contaEncontrada.saldo) {
    return res
      .status(404)
      .json({ mensagem: "Não é possivel realizar o saque" });
  }

  contaEncontrada.saldo -= valor;
  const dataAtual = new Date();
  const registroSaque = {
    data: dataAtual,
    numero_conta: numero_conta,
    valor: valor,
  };
  bancoDeDados.saques.push(registroSaque);

  return res.status(200).json({ mensagem: "Saque realizado com sucesso" });
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
  if (!numero_conta_origem && !numero_conta_destino) {
    return res.status(400).json({
      mensagem: "O campo de numero de conta é obrigatório",
    });
  }
  const contaOrigem = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(numero_conta_origem)
  );
  if (!contaOrigem) {
    return res.status(404).json({ mensagem: "Essa conta origem não existe" });
  }
  const contaDestino = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(numero_conta_destino)
  );
  if (!contaDestino) {
    return res.status(404).json({ mensagem: "Essa conta destino não existe" });
  }

  if (senha !== contaOrigem.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta" });
  }
  for (let item of bancoDeDados.contas) {
    if (item.numero === Number(numero_conta_origem)) {
      if (valor > item.saldo) {
        return res
          .status(404)
          .json({ mensagem: "Não é possivel realizar a transferência" });
      }
    }
  }
  contaOrigem.saldo -= valor;
  contaDestino.saldo += valor;
  const dataAtual = new Date();
  const registroTransferencia = {
    data: dataAtual,
    numero_conta_origem: numero_conta_origem,
    numero_conta_destino: numero_conta_destino,
    valor: valor,
  };
  bancoDeDados.transferencias.push(registroTransferencia);
  return res
    .status(200)
    .json({ mensagem: "Transferência realizada com sucesso" });
};

const consultarSaldo = (req, res) => {
  const { numero_conta, senha } = req.query;
  if (!Number(numero_conta)) {
    return res.status(400).json({
      mensagem: "O campo de numero de conta é obrigatório",
    });
  }
  if (!senha) {
    return res.status(400).json({
      mensagem: "O campo de senha é obrigatório",
    });
  }
  const contaEncontrada = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(numero_conta)
  );
  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "Essa conta não existe" });
  }
  if (senha !== contaEncontrada.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta" });
  }
  let consultorDeSaldo = {
    saldo: contaEncontrada.saldo,
  };
  return res.status(201).json(consultorDeSaldo);
};

const consultarExtrato = (req, res) => {
  const { numero_conta, senha } = req.query;
  if (!Number(numero_conta)) {
    return res.status(400).json({
      mensagem: "O campo de numero de conta é obrigatório",
    });
  }
  if (!senha) {
    return res.status(400).json({
      mensagem: "O campo de senha é obrigatório",
    });
  }
  const contaEncontrada = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(numero_conta)
  );
  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "Essa conta não existe" });
  }
  if (senha !== contaEncontrada.usuario.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta" });
  }
  const extrato = {
    depositos: bancoDeDados.depositos.filter(
      (item) => item.numero_conta === numero_conta
    ),
    saques: bancoDeDados.saques.filter(
      (item) => item.numero_conta === numero_conta
    ),
    transferenciasEnviadas: bancoDeDados.transferencias.filter(
      (item) => item.numero_conta_origem === numero_conta
    ),
    transferenciasRecebidas: bancoDeDados.transferencias.filter(
      (item) => item.numero_conta_destino === numero_conta
    ),
  };
  return res.status(201).json(extrato);
};

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuarioDaConta,
  excluirConta,
  depositar,
  sacar,
  transferir,
  consultarSaldo,
  consultarExtrato,
};
