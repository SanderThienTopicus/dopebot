module.exports = {
  command: 'clear',
  desc: 'Clears the tracklist',
  aliases: ['clean'],
  handler: async function (argv) {
    argv.db.logger.info('Clearing current tracklist');
    await argv.db.mopidy.tracklist.clear();
    argv.db.emit('tracklist:clear');
  }
}
