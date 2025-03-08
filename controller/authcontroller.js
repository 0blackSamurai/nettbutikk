const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/authMiddleware');

const samiskeSprak = ['SØR', 'UME', 'PITE', 'LULE', 'NORD', 'ENARE', 'SKOLT', 'AKKALA', 'KILDIN', 'TER'];

exports.register = async (req, res) => {
    const { navn, epost, passord, confirmpassord, telefon } = req.body;

    if (passord !== confirmpassord) {
        return res.send('Passwords do not match');
    }

    try {
        const hashedPassword = await bcrypt.hash(passord, parseInt(process.env.SALTROUNDS));

        const newUser = new User({
            navn,
            epost,
            passord: hashedPassword,
            telefon
        });

        await newUser.save();
        res.redirect("/login");
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering User');
    }
};

exports.login = async (req, res) => {
    const { epost, passord } = req.body;
    
    const User = await User.findOne({ epost });


    if (!User) {
        return res.status(400).send('Bruker ikke funnet');
    }

    const isMatch = await bcrypt.compare(passord, User.passord);

    if (!isMatch) {
        return res.status(400).send('Feil passord');
    }

    const token = jwt.sign({ Userid: User._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
    res.cookie('User', token, { httpOnly: true });
    
    return res.status(200).redirect("/dashboard");
};

exports.logout = (req, res) => {
    res.clearCookie('User');
    res.redirect("/login");
};

exports.renderRegisterPage = (req, res) => {
    res.render("register", { title: "register", samiskeSprak });
};

exports.renderLoginPage = (req, res) => {
    res.render("login", { title: "login", samiskeSprak });
};

exports.renderDashboardPage = (req, res) => {
    res.render("dashboard", { title: "profile", samiskeSprak });
};
exports.renderFaqPage = (req, res) => {
    res.render("Faq", { title: "Frequently Asked Questions", samiskeSprak });
};
exports.renderDiagramPage = (req, res) => {
    res.render("Diagram", { title: "ER-diagram" });
};
