module.exports = {
  command: 'resume',
  desc: 'Resumes the current track',
  handler: async function (argv) {
    argv.db.logger.info('Resuming current track')
    await argv.db.mopidy.playback.resume()
  }
}
