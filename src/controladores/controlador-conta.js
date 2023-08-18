const dados = require('../bancodedados');
const {
    encontrarConta,
    criarNovaConta,
    criarExtrato,
    formatarDataNascimento,
    validarCpf,
    validarEmail
} = require('../utils');
let numeroConta = 1;


const listarContas = (req, res) => {
    const contasEncontradas = dados.contas;
    if (contasEncontradas.length === 0) return res.status(404).json({ mensagem: 'Nenhuma conta encontrada' });

    return res.json(contasEncontradas);
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos' });

    const dataNascFormat = formatarDataNascimento(data_nascimento);

    const cpfValido = validarCpf(cpf);
    if (!cpfValido) return res.status(400).json({ mensagem: 'Digite um CPF válido' });

    const emailValido = validarEmail(email);
    if (!emailValido) return res.status(400).json({ mensagem: 'Digite um email válido' });

    const novaConta = criarNovaConta(nome, cpf, dataNascFormat, telefone, email, senha, numeroConta);
    dados.contas.push(novaConta);
    numeroConta++;

    return res.status(201).json(novaConta);
};

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) return res.status(400).json({ mensagem: 'Algum campo para atualização deve ser informado' });

    const contaEncontrada = encontrarConta(dados, numeroConta);
    if (!contaEncontrada) return res.status(404).json({ mensagem: 'Não existe conta cadastrada com esse número' });

    if (cpf) {
        const cpfValido = validarCpf(cpf);
        if (!cpfValido) return res.status(400).json({ mensagem: 'Digite um CPF válido' });
        contaEncontrada.usuario.cpf = cpf;
    }
    if (email) {
        const emailValido = validarEmail(email);
        if (!emailValido) return res.status(400).json({ mensagem: 'Digite um email válido' });
        contaEncontrada.usuario.email = email;
    }
    if (data_nascimento) {
        const dataNascFormat = formatarDataNascimento(data_nascimento);
        contaEncontrada.usuario.data_nascimento = dataNascFormat;
    }
    if (telefone) contaEncontrada.usuario.telefone = telefone;
    if (nome) contaEncontrada.usuario.nome = nome;
    if (senha) contaEncontrada.usuario.senha = senha;

    return res.status(200).json({ mensagem: 'Conta atualizada com sucesso' });
};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const contaEncontrada = encontrarConta(dados, numeroConta);
    if (!contaEncontrada) return res.status(404).json({ mensagem: 'Não existe conta cadastrada com esse número' });

    if (contaEncontrada.saldo === 0) {
        dados.contas.splice(dados.contas.indexOf(contaEncontrada), 1);

        return res.status(200).json({ mensagem: 'Conta excluída com sucesso' });
    } else {
        return res.status(400).json({ mensagem: 'Não foi possível realizar a exclusão pois ainda há saldo em conta' });
    }
};

const consultarSaldo = (req, res) => {
    const { numero_conta } = req.query;

    const contaEncontrada = encontrarConta(dados, numero_conta);
    if (!contaEncontrada) return res.status(404).json({ mensagem: 'Não foi encontrada conta com esse número' });

    const saldo = {
        saldo: contaEncontrada.saldo
    };

    return res.status(200).json(saldo);
};

const verificarExtrato = (req, res) => {
    const { numero_conta } = req.query;

    const contaEncontrada = encontrarConta(dados, numero_conta);
    if (!contaEncontrada) return res.status(404).json({ mensagem: 'Não foi encontrada conta com esse número' });

    const numeroContaEncontrada = contaEncontrada.numero;

    const depositos = dados.depositos.filter(deposito => deposito.numero_conta === numeroContaEncontrada);
    const saques = dados.saques.filter(saque => saque.numero_conta === numeroContaEncontrada);
    const transferenciasEnviadas = dados.transferencias.filter(transferencia => transferencia.numero_conta_origem === numeroContaEncontrada);
    const transferenciasRecebidas = dados.transferencias.filter(transferencia => transferencia.numero_conta_destino === numeroContaEncontrada);

    const extratoConta = criarExtrato(depositos, saques, transferenciasEnviadas, transferenciasRecebidas);

    return res.status(200).json(extratoConta);
};

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    consultarSaldo,
    verificarExtrato
};