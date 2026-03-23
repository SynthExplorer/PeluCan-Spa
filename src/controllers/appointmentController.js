const AppointmentModel = require('../models/appointmentModel');

exports.getAllAppointments = (req, res) => {
    AppointmentModel.getAll((err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.render('index', { title: 'Panel de Citas', appointments: rows });
    });
};

exports.getCreateForm = (req, res) => {
    res.render('create', { title: 'Agendar Nueva Cita' });
};

exports.createAppointment = (req, res) => {
    const { pet_name, owner_name, service, appointment_date } = req.body;
    AppointmentModel.create(pet_name, owner_name, service, appointment_date, (err) => {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};

exports.deleteAppointment = (req, res) => {
    const id = req.params.id;
    AppointmentModel.delete(id, (err) => {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};