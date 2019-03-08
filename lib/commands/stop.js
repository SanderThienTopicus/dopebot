module.exports = {
  command: 'stop',
  desc: 'Stops playback',
  aliases: ['st'],
  handler: async function (argv) {
    argv.db.logger.info('Stopping playback')
    await argv.db.mopidy.playback.stop()
    argv.db.mplayer.stop();
  }
}
