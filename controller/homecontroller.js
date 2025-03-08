

const samiskeSprak = ['SØR', 'UME', 'PITE', 'LULE', 'NORD', 'ENARE', 'SKOLT', 'AKKALA', 'KILDIN', 'TER'];

exports.getHomePage = async (req, res) => {
    res.render("index", { title: "Home", samiskeSprak });
};