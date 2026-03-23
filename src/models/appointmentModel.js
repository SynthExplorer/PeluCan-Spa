const db = require('../config/db');

const AppointmentModel = {

    getAll: (callback) => {
        db.all(`
            SELECT appointments.id, owners.name AS owner_name, pets.name AS pet_name,
                   appointments.service, appointments.appointment_date, appointments.status,
                   appointments.peso, appointments.temperatura, appointments.diagnostico
            FROM appointments
            JOIN pets ON appointments.pet_id = pets.id
            JOIN owners ON pets.owner_id = owners.id
            ORDER BY appointments.appointment_date DESC
        `, [], callback);
    },

    create: (pet_name, owner_name, service, appointment_date, peso, temperatura, diagnostico, callback) => {
        db.get("SELECT id FROM owners WHERE name = ?", [owner_name], (err, owner) => {
            if (err) return callback(err);

            const afterOwner = (owner_id) => {
                db.get("SELECT id FROM pets WHERE name = ? AND owner_id = ?", [pet_name, owner_id], (err, pet) => {
                    if (err) return callback(err);

                    const afterPet = (pet_id) => {
                        db.run(
                            "INSERT INTO appointments (pet_id, service, appointment_date, peso, temperatura, diagnostico) VALUES (?, ?, ?, ?, ?, ?)",
                            [pet_id, service, appointment_date, peso || null, temperatura || null, diagnostico || null],
                            callback
                        );
                    };

                    if (pet) {
                        afterPet(pet.id);
                    } else {
                        db.run("INSERT INTO pets (name, owner_id) VALUES (?, ?)", [pet_name, owner_id], function(err) {
                            if (err) return callback(err);
                            afterPet(this.lastID);
                        });
                    }
                });
            };

            if (owner) {
                afterOwner(owner.id);
            } else {
                db.run("INSERT INTO owners (name) VALUES (?)", [owner_name], function(err) {
                    if (err) return callback(err);
                    afterOwner(this.lastID);
                });
            }
        });
    },

    delete: (id, callback) => {
        db.run("DELETE FROM appointments WHERE id = ?", [id], callback);
    }

};

module.exports = AppointmentModel;