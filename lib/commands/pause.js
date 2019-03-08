module.exports = {
  command: 'pause',
  desc: 'Puses the current track',
  handler: async function (argv) {
    argv.db.logger.info('Pausing current track')
    await argv.db.mopidy.playback.pause()
  }
}
