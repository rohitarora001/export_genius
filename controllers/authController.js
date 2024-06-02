const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma')

exports.register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (req.userExist) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        res.status(201).json({ message: 'User created', userId: user.id });
    } catch (error) {
        res.status(400).json({ error: 'An error occurred during registration' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!req.userExist) {
        return res.status(400).json({ error: 'User does not exists' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        res.status(200).json({ token, id: user.id });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

exports.validate = async (req, res) => {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).json({ error: 'No token provided' });
        jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(200).json({ valid: false });
            res.status(200).json({ valid: true });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to authenticate token' });
    }
};

