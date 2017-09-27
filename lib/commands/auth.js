var SpotifyWebApi = require('spotify-web-api-node')

module.exports = {
  command: 'auth',
  desc: 'Generate Spotify authorization URL',
  builder: {
    uri: {
      alias: 'u',
      demand: true,
      type: 'string',
      describe: 'Set the Spotify authentication redirect URI'
    },
    id: {
      alias: 'i',
      demand: true,
      type: 'string',
      describe: 'Set the Spotify client Id'
    }
  },
  handler: function (argv) {
    var scopes = ['user-read-private', 'user-read-email']
    var state = 'dopebot-auth'

    var spotifyApi = new SpotifyWebApi({
      redirectUri: argv.uri,
      clientId: argv.id
    })

    var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state)

    console.log('Your Spotify authorization URL is: ' + authorizeURL)
  }
}
