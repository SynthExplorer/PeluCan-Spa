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

exports.getRegister = (req, res) => {
    res.render('register', { title: 'Crear cuenta', error: null });
};

exports.postRegister = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('register', {
            title: 'Crear cuenta',
            error: 'Usuario y contraseña son obligatorios'
        });
    }

    db.get("SELECT id FROM users WHERE username = ?", [username], (err, existing) => {
        if (err) return res.status(500).send(err.message);

        if (existing) {
            return res.render('register', {
                title: 'Crear cuenta',
                error: 'Ese usuario ya existe'
            });
        }

        const hash = bcrypt.hashSync(password, 10);
        db.run("INSERT INTO users (username, password, role) VALUES (?, ?, 'recepcionista')",
            [username, hash], function(err) {
                if (err) return res.status(500).send(err.message);
                req.session.user = { id: this.lastID, username, role: 'recepcionista' };
                res.redirect('/');
            }
        );
    });
};