/* GET home page. */
const travel = (req, res) =>{
    res.render('travel', { title: 'Travlr Getaways', layout: false });
};

module.exports = {
    travel
};