module.exports = function (track, settings) {
    var text = `removed ${track} from tracklist`
  
    return [{
      'fallback': text,
      'color': settings.color,
      'title': text
    }]
  }
  