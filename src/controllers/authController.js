const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.getLogin = (req, res) => {
    res.render('login', { title: 'Iniciar Sesión', error: null });
};

exports.postLogin = (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).send(err.message);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.render('login', { 
                title: 'Iniciar Sesión', 
                error: 'Usuario o contraseña incorrectos' 
            });
        }

        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.redirect('/');
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};