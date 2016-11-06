const fs = require('fs')
const path = require('path')
const async = require('async')
const emojilib = require('emojilib').lib
const emojiData = require('emoji-data')
const getImageColors = require('get-image-colors')
const nameThatColor = require('color-namer')
const imagesPath = path.join(__dirname, 'vendor/gemoji/images/emoji/unicode')
const codes = fs.readdirSync(imagesPath)
  .map(filename => path.basename(filename, '.png'))

async.map(codes, getColors, done)

function getColors (code, callback) {
  const file = path.join(imagesPath, `${code}.png`)
  getImageColors(file, function (err, colors) {
    if (err) return callback(err)
    const data = {
      emoji: emojiData.from_unified(code).render(),
      code: code,
      color: colors.map(color => color.hex())[0]
    }
    data.colorName = nameThatColor(data.color).roygbiv.map(color => color.name)[0]

    console.log(data.emoji, data.colorName)

    return callback(null, data)
  })
}

function done (err, data) {
  if (err) throw err
  console.log(err, data)
}
