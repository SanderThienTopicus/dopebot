var defaultTypes = ['album', 'artist', 'track', 'playlist']

module.exports = {
  command: 'search <query..>',
  desc: 'Search Spotify',
  builder: {
    types: {
      alias: 't',
      type: 'array',
      choices: defaultTypes,
      default: defaultTypes,
      desc: 'Spotify resource type'
    }
  },
  handler: function (argv) {
    argv.db.login(function () {
      var query = argv.query.join(' ')
      var types = argv.types.slice()
      argv.db.logger.info('Searching for "%s" in types:', query, types)

      argv.db.spotify.client.search(query, types, {
        limit: argv.db.settings.limit,
        offset: 0
      })
      .then(function (data) {
        var maxCount = argv.db.settings.limit
        var typesCount = types.length
        argv.db.spotify.results = {}
        argv.db.spotify.hits = 0
        var hit = 0

        while (maxCount > 0 && typesCount > 0) {
          for (var t = 0; t < typesCount; t++) {
            var type = types[t] + 's'
            if (!argv.db.spotify.results[type]) {
              argv.db.spotify.results[type] = {
                items: [],
                total: data.body[type].total
              }
            }
            var length = argv.db.spotify.results[type].items.length

            if (data.body[type].items[length]) {
              argv.db.spotify.results[type].items[length] = data.body[type].items[length]
              maxCount--
            } else {
              types.splice(t, 1)
              typesCount--
            }
          }
        }

        for (type in argv.db.spotify.results) {
          for (var i = 0; i < argv.db.spotify.results[type].items.length; i++) {
            argv.db.spotify.results[type].items[i].hit = hit = hit + 1
          }
        }

        argv.db.spotify.hits = hit
        if (argv.db.spotify.results.albums && argv.db.spotify.results.albums.items.length > 0) {
          return argv.db.spotify.client.getAlbums(argv.db.spotify.results.albums.items.map(
            function (album) {
              return album.id
            })
          )
        } else {
          return null
        }
      })
      .then(function (data) {
        if (data && data.body) {
          for (var i = 0; i < data.body.albums.length; i++) {
            Object.assign(argv.db.spotify.results.albums.items[i], data.body.albums[i])
          }
        }
        argv.db.post(argv.db.attachments.search(argv.db.spotify.results))
      })
      .catch(function (err) {
        argv.db.logger.error(err)
      })
    })
  }
}
