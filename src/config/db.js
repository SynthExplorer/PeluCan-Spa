const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const bcrypt = require('bcryptjs');
const adminPass = bcrypt.hashSync('admin123', 10);
const vetPass = bcrypt.hashSync('vet123', 10);

db.serialize(() => {

    db.run(`CREATE TABLE owners (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL,
        phone      TEXT,
        email      TEXT
    )`);

    db.run(`CREATE TABLE users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role     TEXT NOT NULL CHECK(role IN ('admin', 'veterinario', 'recepcionista'))
)`);

    db.run(`CREATE TABLE pets (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL,
        species    TEXT,
        breed      TEXT,
        owner_id   INTEGER NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES owners(id)
    )`);

    db.run(`CREATE TABLE appointments (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id           INTEGER NOT NULL,
        service          TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        status           TEXT DEFAULT 'Scheduled',
        created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
        peso        REAL,
        temperatura REAL,
        diagnostico TEXT,
        FOREIGN KEY (pet_id) REFERENCES pets(id)
    )`);

    db.run(`INSERT INTO owners (name) VALUES ('Juan Pérez')`);
    db.run(`INSERT INTO owners (name) VALUES ('Maria García')`);

    db.run(`INSERT INTO pets (name, owner_id) VALUES ('Rex', 1)`);
    db.run(`INSERT INTO pets (name, owner_id) VALUES ('Luna', 2)`);

    db.run(`INSERT INTO appointments (pet_id, service, appointment_date) VALUES (1, 'Corte de Pelo', '2026-02-25 10:00')`);
    db.run(`INSERT INTO appointments (pet_id, service, appointment_date) VALUES (2, 'Baño y Limpieza', '2026-02-25 11:30')`);

    db.run(`INSERT INTO users (username, password, role) VALUES ('admin', '${adminPass}', 'admin')`);
    db.run(`INSERT INTO users (username, password, role) VALUES ('drsmith', '${vetPass}', 'veterinario')`);

});

module.exports = db;