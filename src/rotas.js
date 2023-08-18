const express = require('express');
const { listarContas, 
    criarConta, 
    atualizarUsuario, 
    excluirConta, 
    consultarSaldo, 
    verificarExtrato 
} = require('./controladores/controlador-conta');
const { 
    realizarDeposito, 
    realizarSaque, 
    realizarTransferencia 
} = require('./controladores/controlador-transacoes');
const { 
    validarSenhaBanco, 
    validarDataNascimento, 
    verificarCpfEmail, validarSenhaUsuario, 
    validarSenhaUsuarioBody, 
    validarTelefone 
} = require('./intermediarios/intermediarios');
const rotas = express();

rotas.get('/contas', validarSenhaBanco, listarContas);
rotas.post('/contas', validarDataNascimento, verificarCpfEmail, validarTelefone, criarConta);
rotas.put('/contas/:numeroConta/usuario', validarDataNascimento, verificarCpfEmail, atualizarUsuario);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.get('/contas/saldo', validarSenhaUsuario, consultarSaldo);
rotas.get('/contas/extrato', validarSenhaUsuario, verificarExtrato);

rotas.post('/transacoes/depositar', realizarDeposito);
rotas.post('/transacoes/sacar', validarSenhaUsuarioBody, realizarSaque);
rotas.post('/transacoes/transferir', validarSenhaUsuarioBody, realizarTransferencia);

module.exports = rotas;