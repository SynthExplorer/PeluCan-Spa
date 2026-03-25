const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authController = require('../controllers/authController');
const { isAuthenticated, isVeterinario } = require('../middlewares/authMiddleware');

// Rutas de autenticación
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

// Rutas protegidas
router.get('/', isAuthenticated, appointmentController.getAllAppointments);
router.get('/create', isAuthenticated, isVeterinario, appointmentController.getCreateForm);
router.post('/create', isAuthenticated, isVeterinario, appointmentController.createAppointment);
router.post('/delete/:id', isAuthenticated, appointmentController.deleteAppointment);

module.exports = router;