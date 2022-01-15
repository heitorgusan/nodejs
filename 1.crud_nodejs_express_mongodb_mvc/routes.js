const express = require('express');
const routes = express.Router();
const {ifhomeloginpage} = require('./src/middlewares/globalMiddleware');
const {islogin} = require('./src/middlewares/globalMiddleware');

const homeloginController = require('./src/controllers/homeloginController');
const clientesController = require('./src/controllers/clientesController');
const errorsController = require('./src/controllers/errorsController');
//HomeLogin Page
routes.get('/',ifhomeloginpage,homeloginController.indexhomelogin);
routes.post('/postloginconta',homeloginController.postloginconta);

//Logout
routes.get('/logout',homeloginController.logout);

//Login required
routes.get('/loginrequired',errorsController.loginrequired);

//Visão geral
routes.get('/visaogeral',islogin,homeloginController.visaogeral);
//Criar contas
routes.get('/criarconta',ifhomeloginpage,homeloginController.criarconta);
routes.post('/postcriarconta',homeloginController.postcriarconta);

//Criar clientes
routes.get('/criarclientes',islogin,clientesController.criarclientes);
routes.post('/postcriarclientes',islogin,clientesController.postcriarclientes);

//Listar meus clientes
routes.get('/meusclientes',islogin,clientesController.meusclientes);

//Editar cliente
routes.get('/criarclientes/:id',islogin,clientesController.editcriarclientes);
routes.post('/criarclientes/:id',islogin,clientesController.updatecriarclientes);

//Deletar cliente
routes.get('/criarclientes/delete/:id',islogin,clientesController.deleteclientes);

module.exports = routes;