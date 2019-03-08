module.exports = {
  command: 'remove <id> [position]',
  desc: 'Deletes a song from the queue',
  builder: {
    position: {
      type: 'number',
      desc: 'Tracklist position'
    }
  },
  aliases: ['r'],
  handler: async function (argv) {
    if (Number.isInteger(argv.id)) {
      let index = await argv.db.mopidy.tracklist.index();
      let tracks = await argv.db.mopidy.tracklist.slice([index, index + 100]);

      let trackToRemove = tracks[argv.id];

      if (trackToRemove) {
        await argv.db.mopidy.tracklist.remove({
          'tlid': [trackToRemove.tlid]
        })
        argv.db.post(argv.db.attachments.remove(`${trackToRemove.track.artists[0].name} - ${trackToRemove.track.name}`));
      }
    }
  }
}
