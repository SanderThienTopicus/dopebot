var yargs = require('yargs')

module.exports = function () {
  var argv = yargs
    .usage('Usage: dopebot <command> [options]')
    .command(require('./commands/auth'))
    .command(require('./commands/run'))
    .help('help')
    .alias('help', 'h')
    .locale('en')
    .argv

  if (argv.help) {
    // show help and exit
    yargs.showHelp()
  }
}
