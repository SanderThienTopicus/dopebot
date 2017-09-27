var RtmClient = require('@slack/client').RtmClient
var WebClient = require('@slack/client').WebClient
var Mopidy = require('mopidy')
var SpotifyWebApi = require('spotify-web-api-node')
var winston = require('winston')
var attachments = require('../slack/attachments')
var DopeBot = require('../dopebot').DopeBot

module.exports = {
  command: 'run',
  desc: 'Run dopebot',
  builder: {
    token: {
      alias: 't',
      demand: true,
      type: 'string',
      describe: 'Set token for the Slack API'
    },
    channel: {
      alias: 'c',
      demand: true,
      type: 'string',
      describe: 'Set the Slack channel name to listen for input'
    },
    mopidy: {
      alias: 'm',
      type: 'string',
      describe: 'Set the WS-URL of Mopidy',
      default: 'ws://localhost:6680/mopidy/ws'
    },
    dialog: {
      alias: 'd',
      type: 'boolean',
      describe: 'Only respond to <@dopebot>',
      default: false
    },
    brain: {
      alias: 'b',
      type: 'boolean',
      describe: 'Remember user commands',
      default: false
    },
    unfurl: {
      alias: 'u',
      type: 'boolean',
      describe: 'Unfold Spotify URIs in Slack',
      default: false
    },
    emoji: {
      alias: 'e',
      type: 'string',
      describe: 'Dopebot emoji icon in Slack',
      default: ':loud_sound:'
    },
    id: {
      alias: 'i',
      demand: true,
      type: 'string',
      describe: 'Set the Spotify client Id'
    },
    secret: {
      alias: 's',
      demand: true,
      type: 'string',
      describe: 'Set the Spotify client secret'
    },
    code: {
      alias: 'x',
      type: 'string',
      describe: 'Set the Spotify user authorization code'
    },
    uri: {
      alias: 'u',
      type: 'string',
      describe: 'Set the Spotify authentication redirect URI'
    },
    limit: {
      alias: 'l',
      type: 'number',
      describe: 'Set limit for Spotify API result lists',
      default: 20
    },
    verbose: {
      alias: 'v',
      type: 'count',
      describe: 'Increase verbosity'
    }
  },
  handler: function (argv) {
    var logger = new (winston.Logger)()

    logger.add(winston.transports.Console, {
      level: Object.keys(winston.config.npm.levels).find(function (level) {
        return winston.levels[level] === Math.min(argv.verbose + 2, Object.keys(winston.levels).length - 1)
      }),
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: true
    })

    var slack = {
      rtm: new RtmClient(argv.token, {
        logger: logger.log.bind(logger)
      }),
      web: new WebClient(argv.token, {
        logger: logger.log.bind(logger)
      })
    }

    var mopidy = new Mopidy({
      webSocketUrl: argv.mopidy,
      console: logger,
      autoConnect: false,
      callingConvention: 'by-position-only'
    })

    var spotifyApi = new SpotifyWebApi({
      clientId: argv.id,
      clientSecret: argv.secret,
      redirectUri: argv.uri
    })

    var db = new DopeBot(logger, slack, mopidy, spotifyApi, {
      channel: argv.channel,
      dialog: argv.dialog === true,
      history: argv.brain === true,
      limit: parseInt(argv.limit),
      code: argv.code,
      attachments: attachments({
        color: '#ff9800',
        formatTrack: function (track) {
          return {
            track: `<${track.uri}|${track.name}>`,
            artists: track.artists.map(artist => `<${artist.uri}|${artist.name}>`).join(', '),
            album: `<${track.album.uri}|${track.album.name}>`
          }
        }
      }),
      params: {
        username: 'dopebot',
        icon_emoji: argv.emoji,
        unfurl_links: argv.unfurl === true,
        unfurl_media: argv.unfurl === true
      }
    })

    db.run()
  }
}
