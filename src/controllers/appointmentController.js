
const db = require('../config/db');

exports.getAllAppointments = (req, res) => {
    db.all(`
        SELECT appointments.id, owners.name AS owner_name, pets.name AS pet_name,
        appointments.service, appointments.appointment_date, appointments.status
        FROM appointments
        JOIN pets ON appointments.pet_id = pets.id
        JOIN owners ON pets.owner_id = owners.id
        ORDER BY appointments.appointment_date DESC`
    , [], (err, rows) => {
        if (err){
            return res.status(500).send(err.message);
        }
        res.render('index', { title: 'Panel de Citas', appointments: rows})
    })
};

exports.getCreateForm = (req, res) => {
    res.render('create', { title: 'Agendar Nueva Cita' });
};

exports.createAppointment = (req, res) => {
    const { pet_name, owner_name, service, appointment_date } = req.body;

    // 1. Buscar o crear el dueño
    db.get("SELECT id FROM owners WHERE name = ?", [owner_name], (err, owner) => {
        if (err) return res.status(500).send(err.message);

        const afterOwner = (owner_id) => {
            // 2. Buscar o crear la mascota
            db.get("SELECT id FROM pets WHERE name = ? AND owner_id = ?", [pet_name, owner_id], (err, pet) => {
                if (err) return res.status(500).send(err.message);

                const afterPet = (pet_id) => {
                    // 3. Insertar la cita
                    db.run("INSERT INTO appointments (pet_id, service, appointment_date) VALUES (?, ?, ?)",
                        [pet_id, service, appointment_date],
                        (err) => {
                            if (err) return res.status(500).send(err.message);
                            res.redirect('/');
                        }
                    );
                };

                if (pet) {
                    afterPet(pet.id);
                } else {
                    db.run("INSERT INTO pets (name, owner_id) VALUES (?, ?)", [pet_name, owner_id], function(err) {
                        if (err) return res.status(500).send(err.message);
                        afterPet(this.lastID);
                    });
                }
            });
        };

        if (owner) {
            afterOwner(owner.id);
        } else {
            db.run("INSERT INTO owners (name) VALUES (?)", [owner_name], function(err) {
                if (err) return res.status(500).send(err.message);
                afterOwner(this.lastID);
            });
        }
    });
};

exports.deleteAppointment = (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM appointments WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.redirect('/');
    });
};
