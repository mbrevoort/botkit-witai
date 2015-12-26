var Wit = require('node-wit')

module.exports = function (witToken) {
  return new Intents(witToken)
}

function Intents (witToken) {
  var self = this
  self._intents = {}
  self._witToken = witToken

  self.hears = function (name, confidence, fn) {
    var registration = {
      confidence: confidence,
      fn: fn
    }
    if (!self._intents[name]) {
      self._intents[name] = [registration]
    } else {
      self._intents[name].push(registration)
    }
  }

  self.process = function (bot, message) {
    Wit.captureTextIntent(self._witToken, message.text, function (err, res) {
      if (err) return console.error('Wit.ai Error: ', err)

      console.log(JSON.stringify(res, null, ' '))

      // only consider the 1st outcome
      if (res.outcomes && res.outcomes.length > 0) {
        var outcome = res.outcomes[0]
        var intent = outcome.intent
        if (self._intents[intent]) {
          self._intents[intent].forEach(function (registration) {
            if (outcome.confidence >= registration.confidence) {
              registration.fn(bot, message, outcome)
            }
          })
        }
      }
    })
  }
}
