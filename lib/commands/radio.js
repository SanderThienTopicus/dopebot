const request = require('request');

module.exports = {
  command: 'radio [uri|id]',
  desc: 'Plays a stream resource from the URI',
  handler: function (argv) {

    if (Number.isInteger(argv.id)) {
      argv.db.mopidy.playback.stop()
      argv.db.mopidy.tracklist.clear()
      argv.db.mplayer.stop()

      let radiostation = argv.db.radiosearch.results.filter(val => {
        return val.stationindex == argv.id;
      })

      request(`https://opml.radiotime.com/Tune.ashx?id=${radiostation[0].stationId}&render=json`, { json: true }, (err, res, body )=> {
        if (err) { return console.log(err); }
        argv.db.mplayer.openFile(body.body[0].url, {
          cache: 1024,
          cacheMin: 90
        })
      });
      return;
    }

    argv.db.logger.info('Clearing tracklist')
    argv.db.mopidy.playback.stop()
    argv.db.mplayer.stop()
    argv.db.mopidy.tracklist.clear()
      .then(function () {
        argv.db.emit('tracklist:clear')
        argv.db.mplayer.openFile(argv.uri, {
          cache: 1024,
          cacheMin: 90
        });
      })
    .done(function () {
    })
  }
}