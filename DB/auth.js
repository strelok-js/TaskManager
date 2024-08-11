const User = require('./userModels.js');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ msg: 'User already exists' });

        const newUser = new User({ name, email, password });
        await newUser.save();

        jwt.sign({ user: { id: newUser.id } }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
        if (!user.validatePassword(password)) return res.status(400).json({ msg: 'Invalid credentials' });

        jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.needAuth = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'Token is not providet, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

