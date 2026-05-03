exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
};

exports.isVeterinario = (req, res, next) => {
    if (req.session && req.session.user && 
        (req.session.user.role === 'veterinario' || 
         req.session.user.role === 'admin' || 
         req.session.user.role === 'recepcionista')) {
        return next();
    }
    res.status(403).send('Acceso denegado.');
};