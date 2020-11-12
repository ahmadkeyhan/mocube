const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/types');
var db = mongoose.connection;
var type = require("../models/type")
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});


app.get('/types', (req, res) => {
  res.send(
    [
      {
        "title": "هنرمند",
        "subtitle": ".دیدن زیبایی، آفریدن زیبایی",
        "avatar": "/assets/artist.png",
        "color": "#e03e52",
        "link": "/artist"
      },
      {
        "title": "متفکر",
        "subtitle": ".فکرهای عمیق، سؤال های بزرگ",
        "avatar": "/assets/thinker.png",
        "color": "#263238",
        "link": "/thinker"
      },
      {
        "title": "ماجراجو",
        "subtitle": ".الهام بسیار زیاد، زمان بسیار کم",
        "avatar": "/assets/adventurer.png",
        "color": "#ff5a0e",
        "link": "/adventurer"
      },
      {
        "title": "سازنده",
        "subtitle": ".متعهد به مهارت خودت",
        "avatar": "/assets/maker.png",
        "color": "#375a89",
        "link": "/maker"
      },
      {
        "title": "تهیه کننده",
        "subtitle": ".روند قدرت است",
        "avatar": "/assets/producer.png",
        "color": "#58b73d",
        "link": "/producer"
      },
      {
        "title": "رویا پرداز",
        "subtitle": ".نیروی آزادشده ی تخیل",
        "avatar": "/assets/dreamer.png",
        "color": "#6e2489",
        "link": "/dreamer"
      },
      {
        "title": "مبتکر",
        "subtitle": ".حرکت، تکان، برهم زدن، تکرار",
        "avatar": "/assets/innovator.png",
        "color": "#147061",
        "link": "/innovator"
      },
      {
        "title": "بصیر",
        "subtitle": ".تصور کردن ناممکن",
        "avatar": "/assets/visionary.png",
        "color": "#ffc010",
        "link": "/visionary"
      }
    ]
  )
})


app.listen(process.env.PORT || 8081)
