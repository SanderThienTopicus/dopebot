module.exports = function (list, settings) {
    var text = ''
    var title = ''

    if (list != null && list.length > 0) {
      title = `List of radio stations`
      list.forEach(function (station, index) {
         text = `${text}\n${index + 1}: ${station.Title} ${station.Subtitle}`
      })
    } else {
      title = 'List of radiostations empty'
    }
  
    return [{
      'fallback': title,
      'color': settings.color,
      'title': title,
      'text': text
    }]
  }
  