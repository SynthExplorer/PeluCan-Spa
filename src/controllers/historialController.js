const AppointmentModel = require('../models/appointmentModel');

exports.getPets = (req, res) => {
    AppointmentModel.getAllPets((err, pets) => {
        if (err) return res.status(500).send(err.message);
        res.render('historial', { title: 'Historial Clínico', pets, historial: null, petSelected: null });
    });
};

exports.getHistorial = (req, res) => {
    const pet_id = req.params.pet_id;
    AppointmentModel.getAllPets((err, pets) => {
        if (err) return res.status(500).send(err.message);
        AppointmentModel.getHistorialByPet(pet_id, (err, historial) => {
            if (err) return res.status(500).send(err.message);
            const petSelected = pets.find(p => p.id === parseInt(pet_id));
            res.render('historial', { title: 'Historial Clínico', pets, historial, petSelected });
        });
    });
};