// var fs = require('fs');
// var trips = JSON.parse(fs.readFileSync('./data/trips.json','utf8'));

const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

/* GET travel page - list all trips from API */
const travel = async (req, res) => {
  // console.log('1. Before fetch');
  fetch(tripsEndpoint, options)
    // console.log('2. After fetch, before first .then');
    .then(res => res.json())
    .then(json => {
      // console.log('3. Inside second .then, json received');
      // Check if response is an Array
      if (!Array.isArray(json)) {
        return res.status(500).send('API returned invalid data format');
      }
      // Check if array is empty
      if (json.length === 0) {
        return res.status(404).send('No trips found in database');
      }
      res.render('travel', { title: 'Travlr Getaways', trips: json });
    })
    .catch(err => res.status(500).send(err.message));
};

/* GET travel/:tripCode - show single trip detail from API */
const travelDetail = async (req, res) => {
  const tripCode = req.params.tripCode;
  const detailEndpoint = `http://localhost:3000/api/trips/${tripCode}`;

  fetch(detailEndpoint, options)
    .then(apiRes => apiRes.json())
    .then(json => {
      // API returns array from find() - empty array means not found
      const trip = Array.isArray(json) ? json[0] : json;
      if (!trip || !trip.code) {
        return res.status(404).send('Trip not found');
      }
      res.render('travel-detail', { title: trip.name, trip });
    })
    .catch(err => res.status(500).send(err.message));
};

module.exports = {
  travel,
  travelDetail
};