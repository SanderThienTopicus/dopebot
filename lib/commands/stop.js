module.exports = {
  command: ['stop', 's'],
  desc: 'Stops playback',
  handler: function (argv) {
    argv.db.logger.info('Stopping playback')
    argv.db.mopidy.playback.stop()
    argv.db.mplayer.stop();
  }
}
