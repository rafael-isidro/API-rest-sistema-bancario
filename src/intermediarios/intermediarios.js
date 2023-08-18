const dados = require('../bancodedados');

const validarSenhaBanco = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) return res.status(400).json({ mensagem: 'A senha deve ser informada' });
    if (senha_banco !== dados.banco.senha) return res.status(401).json({ mensagem: 'Senha incorreta' });

    next();
}

const verificarCpfEmail = (req, res, next) => {
    const { cpf, email } = req.body;

    if (cpf) {
        const contaComMesmoCpf = dados.contas.find((conta) => conta.usuario.cpf === cpf);
        if (contaComMesmoCpf) return res.status(409).json({ mensagem: 'Já existe conta cadastrada com o CPF informado' });
    }
    if (email) {
        const contaComMesmoEmail = dados.contas.find((conta) => conta.usuario.email === email);
        if (contaComMesmoEmail) return res.status(409).json({ mensagem: 'Já existe conta cadastrada com o email informado' });
    }

    next();
};

const validarSenhaUsuario = (req, res, next) => {
    let { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) return res.status(400).json({ mensagem: 'O número da conta e a senha devem ser informados.' });

    const contaEncontrada = dados.contas.find(conta => conta.numero === numero_conta);
    if (!contaEncontrada) return res.status(404).json({ mensagem: 'Não foi encontrada conta com esse número' });

    if (senha !== contaEncontrada.usuario.senha) return res.status(401).json({ mensagem: 'Senha incorreta' });

    next();
};

const validarSenhaUsuarioBody = (req, res, next) => {
    const { numero_conta_origem, senha } = req.body;
    let { numero_conta } = req.body;

    if (numero_conta_origem) numero_conta = numero_conta_origem;
    if (!numero_conta || !senha) return res.status(400).json({ mensagem: 'O número da conta e a senha devem ser informados.' });

    const contaEncontrada = dados.contas.find(conta => conta.numero === numero_conta);
    if (!contaEncontrada) return res.status(404).json({ mensagem: 'Não foi encontrada conta com esse número' });

    if (senha !== contaEncontrada.usuario.senha) return res.status(401).json({ mensagem: 'Senha incorreta' });

    next();
};

const validarDataNascimento = (req, res, next) => {
    const { data_nascimento } = req.body
    const tamanhoData = 8;
    if (data_nascimento) {
        const arrayDataNascimento = data_nascimento.split('/');
        const dataNascString = arrayDataNascimento.join('');
        if (dataNascString.length !== tamanhoData || isNaN(Number(dataNascString)) || arrayDataNascimento.length !== 3) return res.status(400).json({ mensagem: 'Digite uma data de nascimento válida' });
    }
    next();
};

const validarTelefone = (req, res, next) => {
    const { telefone } = req.body

    if (telefone && isNaN(Number(telefone))) return res.status(400).json({ mensagem: 'Digite um número de telefone válido' });

    next();
}

module.exports = {
    validarSenhaBanco,
    verificarCpfEmail,
    validarSenhaUsuario,
    validarSenhaUsuarioBody,
    validarDataNascimento,
    validarTelefone
};