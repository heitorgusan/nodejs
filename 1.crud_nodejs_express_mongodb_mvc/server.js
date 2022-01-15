require('dotenv').config();
const express = require('express'); //Express Web Framework
const app = express(); // Inst. express 
const routes = require('./routes'); //Ger. de rotas
const path = require('path'); //Path para caminhos
const mongoose = require('mongoose'); //Mongoose para ger. os Schemas, Models, Input dos dados e conexão com o MongoDB
const flash = require('connect-flash'); //Mensagens Flash
const session = require('express-session'); //Session para armazenar os cookies, flash etc...
const MongoStore = require('connect-mongo'); //Mongo Store para armazenar as sessions/cookies etc.. no MongoDb
const helmet = require('helmet'); //Capacete de segurança - O Helmet aplica algumas camadas de segurança
//Falta importa o CSRF para tokens

//IMPORT MIDDLEWARES
const globalMiddleware = require('./src/middlewares/globalMiddleware');

//Conectando MONGODB
mongoose.connect(process.env.STRINGCONNECTMONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.emit('ConecteiNoBancodeDados');
        console.log('Conectado no banco de dados');
    })
    .catch(e => console.log('Erro na conexão do banco de dados: ' + e));
//Use
app.use(express.urlencoded({ extended: true })); //Ler corpo da requisição POST    
app.use(express.static(path.resolve(__dirname, 'public'))); //Estáticos

const sessionOptions = session({
    secret: 'roadtousa',
    store: MongoStore.create({ mongoUrl: process.env.STRINGCONNECTMONGODB }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias de cookie
        httpOnly: true
    }

});

app.use(sessionOptions);
app.use(flash()); //Flash Messages
app.set('views', path.resolve(__dirname, 'src', 'views')); //Path(caminho) das views
app.set('view engine', 'ejs'); //Engine para renderizar

app.use(helmet());
app.use(globalMiddleware.injectFlashVars);
app.use(globalMiddleware.injectUser);
app.use(routes);

app.on('ConecteiNoBancodeDados', () => {
    app.listen(3000, () => {
        console.log('Servidor conectado: http://localhost:3000');
    });
});