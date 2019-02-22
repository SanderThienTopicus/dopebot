const request = require('request');

function filterByID(obj) {
  if ('ContainerType' in obj && obj.ContainerType === 'Stations') {
    return true;
  }
}

module.exports = {
  command: 'searchradio <query..>',
  desc: 'Search radio Tune in',
  handler: function (argv) {
    var query = argv.query.join('+');

    request(`https://api.tunein.com/profiles?fullTextSearch=true&query=${query}&formats=mp3,aac,ogg`, { json: true }, (err, res, body )=> {
      if (err) { return console.log(err); }

      let stations = body.Items.filter(filterByID)[0].Children
      
      argv.db.radiosearch.results = [];
      
      stations.forEach(function (station, index) {
        argv.db.radiosearch.results.push({ stationindex: index + 1, stationId: station.GuideId});
      });

      argv.db.post(argv.db.attachments.searchradio(stations));
    })
  }
}