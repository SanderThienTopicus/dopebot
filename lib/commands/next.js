module.exports = {
  command: 'next',
  desc: 'Plays the next track from the tracklist',
  aliases: ['skip'],
  handler: async function (argv) {
    argv.db.logger.info('Playing next track');
    await argv.db.mopidy.playback.next();
  }
}
