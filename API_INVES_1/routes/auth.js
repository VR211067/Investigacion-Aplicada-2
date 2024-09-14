const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const user = await User.create({ username, email, password });
        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
        console.error(error); // Imprime el error para depuración
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return nores.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error(error); // Imprime el error para depuración
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Recurso protegido
router.get('/protected-resource', authenticate, (req, res) => {
    res.status(200).json({ message: 'Acceso permitido al recurso protegido' });
});

// Cerrar sesión (opcional)
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
});

// Middleware de autenticación
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

module.exports = router;
