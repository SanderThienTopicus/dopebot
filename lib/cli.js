var RTMClient = require('@slack/client').RTMClient
var WebClient = require('@slack/client').WebClient
var Mopidy = require('mopidy')
var SpotifyWebApi = require('spotify-web-api-node')
var winston = require('winston')
var attachments = require('./attachments')
var DopeBot = require('./dopebot').DopeBot
var yargs = require('yargs')
var MPlayer = require('mplayer');

'use strict'

module.exports = function () {
  var argv = yargs
    .usage('Usage: dopebot [options]')
    .option('token', {
      alias: 't',
      demand: true,
      type: 'string',
      describe: 'Set token for the Slack API'
    })
    .option('channel', {
      alias: 'c',
      demand: true,
      type: 'string',
      describe: 'Set the Slack channel name to listen for input'
    })
    .option('mopidy', {
      alias: 'm',
      type: 'string',
      describe: 'Set the WS-URL of Mopidy',
      default: 'ws://localhost:6680/mopidy/ws'
    })
    .option('dialog', {
      alias: 'd',
      type: 'boolean',
      describe: 'Only respond to <@dopebot>',
      default: false
    })
    .option('brain', {
      alias: 'b',
      type: 'boolean',
      describe: 'Remember user commands',
      default: false
    })
    .option('unfurl', {
      alias: 'u',
      type: 'boolean',
      describe: 'Unfold Spotify URIs in Slack',
      default: false
    })
    .option('emoji', {
      alias: 'e',
      type: 'string',
      describe: 'Dopebot emoji icon in Slack',
      default: ':headphones:'
    })
    .option('limit', {
      alias: 'l',
      type: 'number',
      describe: 'Set limit for Spotify API result lists',
      default: 20
    })
    .option('id', {
      alias: 'i',
      demand: true,
      type: 'string',
      describe: 'Set the Spotify client Id'
    })
    .option('secret', {
      alias: 's',
      demand: true,
      type: 'string',
      describe: 'Set the Spotify client secret'
    })
    .option('verbose', {
      alias: 'v',
      type: 'count',
      describe: 'Increase verbosity'
    })
    .help('help')
    .alias('help', 'h')
    .locale('en')
    .argv

  if (argv.help) {
    // show help and exit
    yargs.showHelp()
  }

  var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'Spotibot' },
    transports: [
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ]
  });

  var slack = {
    rtm: new RTMClient(argv.token, {
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
    clientId : argv.id,
    clientSecret : argv.secret
  })

  var mplayer = new MPlayer();

  var db = new DopeBot(logger, slack, mopidy, spotifyApi, {
    channel: argv.channel,
    dialog: argv.dialog === true,
    history: argv.brain === true,
    limit: parseInt(argv.limit),
    attachments: attachments({
      color: '#ff9800',
      formatTrack: function (track) {
        return {
          track: `<${track.uri}|${track.name}>`,
          artists: track.artists ? track.artists.map(artist => `<${artist.uri}|${artist.name}>`).join(', ') : '',
          album: `<${track.album.uri}|${track.album.name}>`
        }
      }
    }),
    params: {
      username: 'Spotibot',
      icon_emoji: argv.emoji,
      unfurl_links: argv.unfurl === true,
      unfurl_media: argv.unfurl === true
    }
  }, mplayer)

  db.run()
}
