var Botkit = require('botkit')
var Intents = require('./intents')
var env = require('./env')

var slackToken = env('SLACK_TOKEN')
var witToken = env('WIT_TOKEN')

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

var intents = Intents(witToken)

// wire up DMs and direct mentions to wit.ai
controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
  intents.process(bot, message)
})

intents.hears('greeting', 0.5, function (bot, message, outcome) {
  bot.reply(message, 'Hello to you as well!')
})

intents.hears('how_are_you', 0.5, function (bot, message, outcome) {
  bot.reply(message, 'I\'m great my friend!')
})
