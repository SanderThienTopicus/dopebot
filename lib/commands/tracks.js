module.exports = {
  command: 'tracks [length]',
  desc: 'Prints out the current tracklist',
  aliases: ['list'],
  builder: {
    length: {
      type: 'number',
      desc: 'Number of tracks to output',
      default: 10
    }
  },
  aliases: ['t'],
  handler: async function (argv) {
    if (argv.db.state != null && argv.db.state.random || (argv.db.state.repeat && argv.db.state.single) || argv.db.state.single) {
      argv.db.logger.info('Getting next track')
      argv.db.mopidy.tracklist.nextTrack(argv.db.state.tlTrack)
        .done(function (tlTrack) {
          if (argv.db.settings.history === true) {
            tlTrack.history = argv.db.getHistoryState(tlTrack.tlid)
          }

          argv.db.post(argv.db.attachments.next(tlTrack))
        })
      return
    }

    try {
      argv.db.logger.info('Getting current tracklist')

      let currentIndex = await argv.db.mopidy.tracklist.index();
      let currentLength = await argv.db.mopidy.tracklist.getLength();

      currentIndex = currentIndex ? currentIndex : 0;
      let tlTracks = await argv.db.mopidy.tracklist.slice([currentIndex, currentIndex + parseInt(argv.length)])
      tlTracks = tlTracks || []
      tlTracks = tlTracks.map(function (currentValue, i) {
        currentValue.index = currentIndex + i
        if (argv.db.settings.history === true) {
          currentValue.history = argv.db.getHistoryState(currentValue.tlid)
        }
        return currentValue
      }, this)
      argv.db.post(argv.db.attachments.tracks(tlTracks, currentLength))
    } catch (error) {
      argv.db.logger.info('Getting current tracklist failed: ' + error)
    };
  }
}
