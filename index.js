var Botkit = require('botkit')
var Witbot = require('witbot')
var env = require('./env')

var slackToken = env('SLACK_TOKEN')
var witToken = env('WIT_TOKEN')
var openWeatherApiKey = env('OPENWEATHER_KEY')

var controller = Botkit.slackbot({
  debug: false
})

controller.spawn({
  token: slackToken
}).startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Error connecting to slack: ', err)
  }
  console.log('Connected to slack')
})

var witbot = Witbot(witToken)

// wire up DMs and direct mentions to wit.ai
controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
  witbot.process(message.text, bot, message)
})

witbot.hears('greeting', 0.5, function (bot, message, outcome) {
  bot.reply(message, 'Hello to you as well!')
})

witbot.hears('how_are_you', 0.5, function (bot, message, outcome) {
  bot.reply(message, 'I\'m great my friend!')
})

var weather = require('./weather')(openWeatherApiKey)

witbot.hears('weather', 0.5, function (bot, message, outcome) {
  if (!outcome.entities.location || outcome.entities.location.length === 0) {
    bot.reply(message, 'I\'d love to give you the weather but for where?')
    return
  }
  var location = outcome.entities.location[0].value
  weather.get(location, function (error, msg) {
    if (error) {
      console.error(error)
      bot.reply(message, 'uh oh, there was a problem getting the weather')
      return
    }
    bot.reply(message, msg)
  })
})
