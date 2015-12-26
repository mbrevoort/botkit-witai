module.exports = function (name) {
  var val = process.env[name]
  if (!val) {
    console.error(name + ' is required!')
    process.exit(1)
  }
  return val
}
