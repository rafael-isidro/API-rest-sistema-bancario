const { format } = require('date-fns');

function registrarDeposito(dados, numero_conta, valor) {
    const data = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const registroDeposito = {
        data,
        numero_conta,
        valor
    };
    dados.depositos.push(registroDeposito);
}

function registrarSaque(dados, numero_conta, valor) {
    const data = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const registroSaque = {
        data,
        numero_conta,
        valor
    };

    dados.saques.push(registroSaque);
}

function registrarTransferencia(dados, numero_conta_origem, numero_conta_destino, valor) {
    const data = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const registroTransferencia = {
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    };

    dados.transferencias.push(registroTransferencia);
}

function encontrarConta(dados, numero_conta) {
    return dados.contas.find((conta) => conta.numero === numero_conta);
}

function criarNovaConta(nome, cpf, dataNascFormat, telefone, email, senha, numeroConta) {
    let saldo = 0;
    return {
        numero: String(numeroConta),
        saldo,
        usuario: {
            nome,
            cpf,
            data_nascimento: dataNascFormat,
            telefone,
            email,
            senha
        }
    };
}

function criarExtrato(depositos, saques, transferenciasEnviadas, transferenciasRecebidas) {
    return {
        depositos,
        saques,
        transferenciasEnviadas,
        transferenciasRecebidas
    };
}

function formatarDataNascimento(data_nascimento) {
    const arrayDataNascimento = data_nascimento.split('/');
    const dataNascFormat = arrayDataNascimento[2] + '-' + arrayDataNascimento[1] + '-' + arrayDataNascimento[0];
    return dataNascFormat;
}

function validarCpf(cpf) {
    const tamanhoCpf = 11;
    return (cpf.length === tamanhoCpf && !isNaN(Number(cpf)));
}

function validarEmail(email) {
    const indiceArroba = email.indexOf('@');
    const indicePonto = email.indexOf('.', indiceArroba);
    
    return (indiceArroba > 0 && indicePonto > indiceArroba);
}

module.exports = {
    registrarDeposito,
    registrarSaque,
    registrarTransferencia,
    encontrarConta,
    criarNovaConta,
    criarExtrato,
    formatarDataNascimento,
    validarCpf,
    validarEmail
};