module.exports = {
  command: 'queue <id|uri> [position]',
  desc: 'Enqueues a Spotify resource from the last search results or URI',
  builder: {
    uri: {
      desc: 'Spotify URI'
    },
    position: {
      type: 'number',
      desc: 'Tracklist position'
    }
  },
  aliases: ['q'],
  handler: async function (argv) {
    if (Number.isInteger(argv.id)) {
      for (var type in argv.db.search.results) {
        for (var i = 0; i < argv.db.search.results[type].items.length; i++) {
          if (argv.db.search.results[type].items[i].hit === argv.id) {
            argv.uri = argv.db.search.results[type].items[i].uri
            break
          }
        }
      }
    }

    if (typeof argv.uri !== 'string' || !argv.uri.match(/spotify:[\w:]+[a-zA-Z0-9]{22}/)) {
      return
    }

    let tracks = await argv.db.mopidy.tracklist.add([null, parseInt(argv.position), argv.uri, null])
    argv.db.emit('tracklist:add', argv.message, tracks)
    argv.db.post(argv.db.attachments.play(argv.uri))
  }
}
