const mongoose = require('mongoose');

//Schema

const ClienteSchema = mongoose.Schema({
    nome:{type: String , required: true},
    cep:{type:String , required:false},
    logradouro:{type:String , required:false},
    numero:{type:String , required:false},
    complemento:{type:String , required:false},
    bairro:{type:String , required:false},
    cidade:{type:String , required:false},
    estado:{type:String , required:false},
    criadoEm:{type:Date , default:Date.now}
});

//Model


const ClienteModel = mongoose.model('clientes',ClienteSchema);

class Cliente {
    constructor(body){
        this.body = {
            nome: body.nome,
            cep: body.cep,
            logradouro: body.logradouro,
            numero: body.numero,
            bairro: body.bairro,
            cidade: body.cidade,
            estado: body.estado
        }
        this.errors = [];
        this.clienteVar = null;
    }
    //STATICOS
    static async findCliente(id){
        const clienteBuscado = await ClienteModel.findById(id);
        return clienteBuscado;
    }
    static async listarClientes(){
        const clientes = await ClienteModel.find().sort({criadoEm: -1});
        return clientes;
    }

    static async deleteCliente(id){
        await ClienteModel.findOneAndDelete({_id:id});
        
    }

    
    //INSTANCIADOS
    async createNewCliente(){
        this.validarCliente();
        if(this.errors.length > 0 )return;
        
        this.clienteVar = await ClienteModel.create(this.body);
    }
    
    async editOldCliente(id){
        this.validarCliente();
        if(this.errors.length > 0) return;
        this.clienteVar = await ClienteModel.findByIdAndUpdate(id,this.body,{new:true});
    }
    
    validarCliente(){
        if(this.body.nome == '') this.errors.push('O nome está vázio.');
        if(this.body.cep.length > 8 || this.body.cep.length > 0 && this.body.cep.length < 8 ) this.errors.push('CEP inválido.');
    }
}



module.exports = Cliente;







// Minha referência
// Contato.delete = async function(id){
//     if(typeof id !== 'string')return
//     const contato = ContatoModel.findOneAndDelete({_id:id});
   
//     return contato;
// }