const Cliente = require('../models/ClienteModel');

//GET //////////////////////////////////////////
exports.criarclientes = (req,res)=>{
    
    res.render('criarclientespage',{clienteProcurado:{}});
}

exports.editcriarclientes = async (req,res)=>{
    const clienteProcurado = await Cliente.findCliente(req.params.id);

    res.render('criarclientespage',{clienteProcurado});
}

exports.meusclientes = async (req,res)=>{
    const clientes = await Cliente.listarClientes();
    console.log(clientes);
    res.render('meusclientespage',{clientes});
}

exports.deleteclientes = async(req,res)=>{
    await Cliente.deleteCliente(req.params.id);
    req.session.save(()=>{
        req.flash('msgSuccess','Cliente excluido com sucesso');
        return res.redirect('/meusclientes');
    });
}

//POST /////////////////////////////////////////////
exports.updatecriarclientes = async(req,res)=>{
    const cliente = new Cliente(req.body);
    await cliente.editOldCliente(req.params.id);
    res.redirect(`/criarclientes/${cliente.clienteVar._id}`);
}
exports.postcriarclientes = async (req,res)=>{
    const cliente = new Cliente(req.body);
    await cliente.createNewCliente();
    
    if(cliente.errors.length > 0 ){
        req.flash('msgErrors',cliente.errors);
        req.session.save(()=>{
            return res.redirect('/criarclientes');
        });
        return;
    }
    req.session.save(()=>{
        req.flash('msgSuccess','Cliente criado com sucesso!');
        return res.redirect(`/criarclientes/${cliente.clienteVar._id}`);
    });
}
