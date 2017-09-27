module.exports = {
  command: 'top <type>',
  desc: 'Get dopebot\'s Spotify top played resources',
  builder: {
    type: {
      desc: 'Spotify resource type',
      choices: ['artists', 'tracks'],
      default: 'artists'
    }
  },
  handler: function (argv) {
    argv.db.login(function () {
      var caller = null
      var type = argv.type || 'artists'
      if (type === 'tracks') {
        caller = argv.db.spotify.client.getMyTopTracks
      } else {
        caller = argv.db.spotify.client.getMyTopArtists
      }

      caller.call(argv.db.spotify.client)
      .then(function (data) {
        argv.db.spotify.results = {}
        argv.db.spotify.results[type] = { items: data.body.items }
        argv.db.spotify.hits = data.body.items.length
        argv.db.post(argv.db.attachments.search(argv.db.spotify.results))
      })
      .catch(function (err) {
        argv.db.logger.error(err)
      })
    })
  }
}
