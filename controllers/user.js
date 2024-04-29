const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {

        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json('Fill in all the fields.');
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(401).json('User already exist.');
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: encryptedPassword
        })
        const token = jwt.sign(
            { id: user._id, email },
            'aDiTyAhErO69@#$',
            {
                expiresIn: '2h'
            }
        );
        user.token = token;
        user.password = undefined;
        res.status(200).json({ message: 'New user registered.', user });

    } catch (err) {
        res.status(500).json('In the catch part :(');
    }
}

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json('Fill in all the fields.');
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json('User does not exists.');
        }
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user._id, email },
                'aDiTyAhErO69@#$',
                {
                    expiresIn: '2h'
                }
            );
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true 
            };
            res.status(200).cookie('token', token, options).json({
                message: 'Successfully loged in.',
                success: true,
                user
            })
        } else {
            res.status(400).json('Unauthorize')
        }

    } catch (err) {
        res.status(500).json('In the catch part :(');
    }
}

module.exports = { registerUser, loginUser };

