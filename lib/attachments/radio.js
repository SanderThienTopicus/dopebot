module.exports = function (uri, settings) {
    var text = `Playing stream: ${uri} `
  
    return [{
      'fallback': text,
      'color': settings.color,
      'title': text
    }]
  }
  