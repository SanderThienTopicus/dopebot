module.exports = {
  command: 'radio [uri]',
  desc: 'Plays a stream resource from the URI',
  handler: function (argv) {
    argv.db.logger.info('Clearing tracklist')
    argv.db.mopidy.playback.stop()
    argv.db.mopidy.tracklist.clear()
    .then(function () {
      argv.db.emit('tracklist:clear')
      argv.db.mplayer.openFile(argv.uri);
    })
    .done(function () {
    })
  }
}