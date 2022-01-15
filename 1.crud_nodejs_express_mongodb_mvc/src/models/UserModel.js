const mongoose = require('mongoose');
const validator = require('validator'); //Validar senha
const bcryptjs = require('bcryptjs');//Criptografar senha
//Schema

const UserSchema = mongoose.Schema({
    email:{type:String , required:true},
    senha:{type: String, required: true},
    criadoEm:{type:Date, default:Date.now()}
});


//Model

const UserModel = mongoose.model('users',UserSchema);



//Class
class User{
    constructor(body){
        this.body = {
            email: body.email,
            senha: body.senha
        }
        this.errors = [];
        this.userVar  = null;
    }
    async loginUser(){
        this.validarUser();
        if(this.errors.length>0) return;
        try{
            this.userVar = await UserModel.findOne({email:this.body.email});
        }catch(e){
            console.log('Erro ao buscar usuário: '+e);
        }
        
        //Se a conta não estiver cadastrada no banco de dados.
        if(!this.userVar){
            this.errors.push('Usuário não encontrado ou senha inválida');
            return;
        }

        //Se a senha não coincide
        if(!bcryptjs.compareSync(this.body.senha,this.userVar.senha)){
            this.errors.push('Senha inválida');
            this.userVar = null;
            return;
        }

    }
    async createNewUser(){
        try{
            await this.userExists();
        }catch(e){
            console.log('Erro ao buscar o usuário: '+e);
        }
        if(this.errors.length > 0) return;
        this.validarUser();
        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();//Hash senha
        this.body.senha = bcryptjs.hashSync(this.body.senha,salt);//Criptografando a senha
        await UserModel.create(this.body);
    }

    async userExists(){
        const userProcurado =   await UserModel.findOne({email:this.body.email});
        if(userProcurado)this.errors.push('Conta já cadastrada');
    }

    validarUser(){
        this.cleanUp();
        if(!validator.isEmail(this.body.email))this.errors.push('Email inválido. Exemplo de email: nome@email.com');
        if(this.body.senha.length < 8 || this.body.length > 20)this.errors.push('A senha deve ter tamanho de 8 a 20 caractéres.');
    }

    cleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string')this.body[key]='';
        }
    }
}

module.exports = User;