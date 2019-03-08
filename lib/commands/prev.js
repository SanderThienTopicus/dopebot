module.exports = {
  command: 'prev',
  desc: 'Plays the previous track from the tracklist',
  handler: async function (argv) {
    argv.db.logger.info('Playing previous track')
    await argv.db.mopidy.playback.previous()
  }
}
