const dados = require('../bancodedados');
const { 
    registrarDeposito, 
    encontrarConta, 
    registrarSaque, 
    registrarTransferencia 
} = require('../utils');

const realizarDeposito = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) res.status(400).json({ mensagem: 'O número da conta e o valor do depósito devem ser informados' });
    const contaEncontrada = encontrarConta(dados, numero_conta);
    if (!contaEncontrada) return res.status(404).json({ mensagem: 'Não existe conta cadastrada com esse número' });
    if (valor <= 0) return res.status(400).json({ mensagem: 'Deve ser informado um número positivo no valor para realizar o depósito' });

    contaEncontrada.saldo += valor;

    registrarDeposito(dados, numero_conta, valor);

    return res.status(201).json({ mensagem: 'Depósito realizado com sucesso' });
};

const realizarSaque = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!valor) res.status(400).json({ mensagem: 'O valor do saque deve ser informado' });
    const contaEncontrada = encontrarConta(dados, numero_conta);
    if (!contaEncontrada) return res.status(404).json({ mensagem: 'Não existe conta cadastrada com esse número' });
    if (valor > contaEncontrada.saldo) return res.status(400).json({ mensagem: 'O valor informado para o saque excede o saldo disponível' });

    contaEncontrada.saldo -= valor;

    registrarSaque(dados, numero_conta, valor);

    return res.status(201).json({ mensagem: 'Saque realizado com sucesso' });
};

const realizarTransferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor) res.status(400).json({ mensagem: 'Todos os campos devem ser informados' });

    if (numero_conta_origem === numero_conta_destino) return res.status(400).json({ mensagem: 'O número da conta de destino deve ser diferente da conta de origem da transferência' });

    const contaOrigem = dados.contas.find(conta => conta.numero === numero_conta_origem);
    if (!contaOrigem) return res.status(404).json({ mensagem: 'A conta de origem da transferência não foi encontrada' });

    const contaDestino = dados.contas.find(conta => conta.numero === numero_conta_destino);
    if (!contaDestino) return res.status(404).json({ mensagem: 'A conta de destino da transferência não foi encontrada' });
    
    if (valor > contaOrigem.saldo) return res.status(400).json({ mensagem: 'O valor informado para a transferência excede o saldo disponível da conta de origem' });

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    registrarTransferencia(dados, numero_conta_origem, numero_conta_destino, valor);

    return res.status(201).json({ mensagem: 'Transferência realizada com sucesso' });
};

module.exports = {
    realizarDeposito,
    realizarSaque,
    realizarTransferencia
};