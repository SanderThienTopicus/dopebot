module.exports = {
  command: 'volume [amount|direction]',
  desc: 'Getting / Setting the volume',
  aliases: ['vol'],
  handler: function (argv) {
    if (argv.amount && !isNaN(argv.amount)) {
      if(argv.amount > 0) {
        argv.db.logger.info('Setting volume to %d', argv.amount)
        argv.db.mopidy.mixer.setVolume(argv.amount)
        .done(function (volume) {
          argv.db.post(argv.db.attachments.volume(argv.amount))
        })
      }
    } else {
      argv.db.logger.info('Getting volume')
      argv.db.mopidy.mixer.getVolume()
      .done(function (volume) {
        argv.db.post(argv.db.attachments.volume(volume))
      })
    }
  }
}