exports.injectFlashVars = (req, res, next) => {
    res.locals.msgSuccess = req.flash('msgSuccess');
    res.locals.msgErrors = req.flash('msgErrors');
    next();
};

exports.injectUser = (req, res, next) => {
    res.locals.user = req.session.user;
    next();
}

exports.ifhomeloginpage = (req, res, next) => {
    if (!req.session.user) {
        next();
        return;
    }
    return res.redirect('/visaogeral');
}

exports.islogin = (req, res, next) => {

    if (!req.session.user) {
        return res.redirect('/loginrequired');
    }

    next();
}