module.exports = {
  command: 'state',
  desc: 'Gets the current playback state',
  aliases: ['status'],
  handler: async function (argv) {
    await argv.db.updateHistoryState();
    argv.db.post(argv.db.attachments.state(argv.db.state));
  }
}