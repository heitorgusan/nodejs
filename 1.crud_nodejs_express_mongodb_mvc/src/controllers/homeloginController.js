const session = require('express-session');
const User = require('../models/UserModel');
//GETS
exports.indexhomelogin = (req,res) => {
    res.render('homeloginpage');
}

exports.criarconta = (req,res)=>{
    res.render('criarcontapage');
}

exports.visaogeral = (req,res)=>{
    res.render('visaogeralpage');
}
//POST

exports.postloginconta = async(req,res)=>{
    const user = new User(req.body);
    await user.loginUser();

    if(user.errors.length > 0 ){
        req.flash('msgErrors',user.errors);
        req.session.save(()=>{
            return res.redirect('/');
        });
        return;
    }

    req.flash('msgSuccess','User encontrado');
    req.session.save(()=>{
        req.session.user = user.userVar;//Importante
        console.log(req.session);
        return res.redirect('/visaogeral');
    });
}

exports.postcriarconta = async (req,res)=>{
   const newUser = new User(req.body);
    try{
        await newUser.createNewUser();
        
        if(newUser.errors.length > 0){
            req.flash('msgErrors',newUser.errors);
            req.session.save(()=>{
                return res.redirect('/criarconta');
            });
            return;
        }

        req.flash('msgSuccess','Conta Criada com sucesso!!');
        req.session.save(()=>{
            return res.redirect('/criarconta');
        });

    }catch(e){
        console.log('Erro na criação da conta: '+ e);
    }
}

exports.logout = (req,res)=>{
    req.session.destroy();
    res.redirect('/');
}