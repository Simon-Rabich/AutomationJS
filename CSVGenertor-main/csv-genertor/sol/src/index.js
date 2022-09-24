let config = require('./config')
const nodemailer = require('nodemailer')
let format = require('date-fns/format')
let prompt = require('prompt-sync')()
require('events').EventEmitter.defaultMaxListeners = 3000;
let { getMaxListeners } = require('process')
const { EventEmitter } = require('stream')
const WebSocket = require('ws')
let request = require('request')
const fs = require('fs')
const mysql = require("mysql")
const fastcsv = require("fast-csv")

let slippage
let loop
let product_id
let quantity

function grabArgs() {

  return new Promise((resolve, reject) => {

    try {

      console.log(' \n   ------- Grab privided args -------  \n ')

      console.log('                /\\_/\\                             ')
      console.log('               / 0 0 \\                             ')
      console.log('              ====v====           __   __           ')
      console.log('               \\  W  /          _(  )_(  )_        ')
      console.log('               |     |      .-=(_   WEB  _)         ')
      console.log('               / ___ \\    /      (__   __)         ')
      console.log('              / /   \\ \\  |          (__)          ')
      console.log('             (((-----)))-                           ')

      console.log(' \n   ------- Optional Arguments -------  \n ')

      name = prompt('1) What is your name? ')
      slippage = prompt('3) What is your slippage? ')
      loop = prompt('4) What is your main loop? ')
      product_id = prompt('5) What is your product_id? ')
      quantity = prompt('6) What is your quantity? ')

      console.log(`\nHey there... ${name}`)
      console.log(`you took loop of: ${loop}`)
      console.log(`you took slippage of: ${slippage}`)
      console.log(`you took productID of: ${product_id}`)
      console.log(`you took quantity of: ${quantity}\n`)
      console.log(`Wait for a document in this address.`)

      resolve()

    } catch (error) { reject(error) }

  })

}
function getJsonWebSocket(dir, ws) {

  return new Promise((resolve, reject) => {

    try {

      responseCounter = 0

      ws.on('message', function incoming(data) {

        const obj = JSON.parse(data)

        if (responseCounter > 6) {

          if (obj[dir] && obj[dir][0]) {

            resolve(obj)

          }

        }

        responseCounter++
      });

    } catch (error) { reject(error) }

  })

}
function putToken() {

  return new Promise((resolve, reject) => {

    let options = {
      'method': config.verb.put,
      'url': config.URI.urlauth,
      'headers': {},

      form: {
        'username': config.cerd.user,
        'password': config.cerd.pass
      }
    };

    request(options, (error, response) => {

      if (error) reject(error);

      resolve(JSON.parse(response.body)['key']) // return

    });

  });

}
function quoteBuy(token) {

  return new Promise((resolve, reject) => {

    let options = {
      'method': config.verb.post,
      'url': config.URI.urlquote,
      'headers': {

        'Authorization': token,

      },
      formData: {
        'side': config.side.buy,
        'product_id': product_id,
        'quantity': quantity
      }
    }

    request(options, (err, res) => {
      if (err) reject(err);
      resolve(JSON.parse(res.body)['price'])

    })

  })

}
function quoteSell(token) {

  return new Promise((resolve, reject) => {

    let options = {
      'method': config.verb.post,
      'url': config.URI.urlquote,
      'headers': {

        'Authorization': token,

      },
      formData: {
        'side': config.side.sell,
        'product_id': product_id,
        'quantity': quantity
      }
    }

    request(options, (err, res) => {
      if (err) reject(err);
      resolve(JSON.parse(res.body)['price'])
    })

  })

}
function tradeBuy(token, slippage, price) {

  let start = new Date()
  start = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx").replace("T", " ").replace("+", " ")

  return new Promise((resolve, reject) => {

    let options = {
      'method': config.verb.post,
      'url': config.URI.url,
      'time': true,
      'headers': {
        'Authorization': token
      },

      formData: {
        'type': config.type.fok,
        'side': config.side.buy,
        'product_id': product_id,
        'quantity': quantity,
        'price': price,
        'slippage': slippage

      }
    }

    request(options, (err, res) => {

      end = new Date()
      res.resTime = new Date() - start
      elapsed_time_ms = res.resTime
      valid_elapsed_time_ms = res.elapsedTime
      timeResponseOfBuyTrade = res.headers.date.replace(",", "").timeResponseOfBuyTrade = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx").replace("T", " ").replace("+", " ")
      validation_res_time = res.headers.date

      if (err) reject(err)
      resolve({ "status_code": res.statusCode, "request_time": start, "response time": timeResponseOfBuyTrade, "elapsed_time": res.elapsedTime, "body": JSON.parse(res.body) })

    })

  })

}
function tradeSell(token, slippage, price) {

  let start = new Date()
  start = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx").replace("T", " ").replace("+", " ")

  return new Promise((resolve, reject) => {

    let options = {
      'method': config.verb.post,
      'url': config.URI.url,
      'time': true,
      'headers': {
        'Authorization': token
      },

      formData: {
        'type': config.type.fok,
        'side': config.side.sell,
        'product_id': product_id,
        'quantity': quantity,
        'price': price,
        'slippage': slippage

      }
    }

    request(options, (err, res) => {

      res.resTime = new Date() - start
      end = new Date()
      elapsed_time_ms = res.resTime
      valid_elapsed_time_ms = res.elapsedTime
      timeResponseOfTrade = res.headers.date.replace(",", "").timeResponseOfTrade = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx").replace("T", " ").replace("+", " ")
      validation_res_time = res.headers.date

      if (err) reject(err)
      resolve({ "status_code": res.statusCode, "request_time": start, "response time": timeResponseOfTrade, "elapsed_time": res.elapsedTime, "body": JSON.parse(res.body) })

    })

  })

}
function sendEmail(email) {

  return new Promise((resolve, reject) => {

    try {

      // An email SMPT POP3  
      let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: '',
          pass: ''
        }
      })

      let message = {
        from: "som",
        to: email,
        subject: "Statistics - [external ec2]",
        html: "<b>Ola! Please check the attachment for a surprise! 😊<b>",
        attachments: [
          {
            filename: dataPath,
            content: fs.createReadStream('data.csv')
          }
        ]
      }

      transporter.sendMail(message, function (err, info) {

        if (err) {
          console.log(err)

        } else {
          console.log('\nHTTP requests has done!', '\nemail has sent!', info.messageId) // .respons
        }

      })
      //resolve()

    } catch (error) { reject(error) }

  })

}
function loadCsv() {

  return new Promise((resolve, reject) => {

    try {

      console.log("DB loading...")
      // connect , load csv to mysql       
      let stream = fs.createReadStream("data.csv")
      let csvData = []
      let csvStream = fastcsv
        .parse()
        .on("data", function (data) {
          csvData.push(data)
        })
        .on("end", function () {
          // remove the first line: header
          csvData.shift()

          // create a new connection to the database
          const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "1qa",
            database: "mydb"
          })

          // open the connection
          connection.connect(error => {
            if (error) {
              console.error(error);
            } else {
              let query =
                "INSERT INTO trades (row_num, side, product_name, request_time, response_time, elapsed_time_ms, websocket_price, execute_price, quantity, slippage, trade_id, timestamp_ws_tick, http_code) VALUES ?";
              connection.query(query, [csvData], (error, response) => {
                console.log(error /*|| response + process.exit(0)*/)

              })
            }
          })
        })

      stream.pipe(csvStream)
      console.log("DB has loaded!")

      resolve()

    } catch (error) { reject(error) }

  })

}
// anonymous async function to execute some code synchronously 
(async () => {

  grabArgs()

  dataPath = 'data.csv'

  try { fs.unlinkSync(dataPath) } catch (err) { }

  let tokenPromise = putToken();
  let token = await tokenPromise;

  fs.appendFileSync(dataPath, 'row_num' + ',' + 'side' + ',' + 'product_name' + ',' + 'request_time' + ',' + 'response_time' + ',' + 'elapsed_time_ms' + ',' + 'websocket_price' + ',' + 'execute_price' + ',' + 'quantity' + ',' + 'slippage' + ',' + 'trade_id' + ',' + 'timestamp_ws_tick' + ',' + 'http_code' + '\n')

  let rowsCounter = 1

  const ws = new WebSocket('wss://sandbox.io/')

  ws.on('open', function open() {

    if (product_id == '1') {
      ws.send(config.wss.btceur)
    } else if (product_id == '2') {
      ws.send(config.wss.btcusd)
    } else if (product_id == '5') {
      ws.send(config.wss.ltcusd)
    } else if (product_id == '7') {
      ws.send(config.wss.etheur)
    } else if (product_id == '8') {
      ws.send(config.wss.ethusd)
    } else if (product_id == '11') {
      ws.send(config.wss.xrpusd)
    } else if (product_id == '14') {
      ws.send(config.wss.bchusd)
    } else if (product_id == '16') {
      ws.send(config.wss.btcgbp)
    } else if (product_id == '25') {
      ws.send(config.wss.btcusdt)
    } else if (product_id == '26') {
      ws.send(config.wss.usdtusd)
    } else if (product_id == '29') {
      ws.send(config.wss.btcusdc)
    } else if (product_id == '39') {
      ws.send(config.wss.ethusdt)
    } else if (product_id == '69') {
      ws.send(config.wss.batusd)
    } else if (product_id == '90') {
      ws.send(config.wss.yfiusd)
    } else if (product_id == '91') {
      ws.send(config.wss.sushiusd)
    } else if (product_id == '92') {
      ws.send(config.wss.maticusd)
    } else if (product_id == '93') {
      ws.send(config.wss.aaveusd)
    } else if (product_id == '94') {
      ws.send(config.wss.linkusd)
    } else if (product_id == '101') {
      ws.send(config.wss.enjusd)
    } else if (product_id == '102') {
      ws.send(config.wss.crvusd)
    } else if (product_id == '103') {
      ws.send(config.wss.manausd)
    }
  })

  for (let index = 0; index <= loop; index++) {

    for (let j = 0; j <= slippage; j++) {

      let webSocketJson
      let price
      let timestampPrice
      let buyQuote

      try {
        // Json from Web-Socket 
        webSocketJson = await getJsonWebSocket('asks', ws)
        price = webSocketJson['asks'][0]['price']
        timestampPrice = webSocketJson['timestamp'].replace("T", " T ").replace("+", " + ").replace("Z", " ")

      } catch (err) {

        quoteBuyPromise = quoteBuy(token)
        buyQuote = await quoteBuyPromise

      }

      let buyPromise = tradeBuy(token, j, price)
      let buy = await buyPromise
      console.log(buy)

      // Make it an object 
      buyObj = buy

      // Data infusion from respons of trade buy
      side = buyObj['body']['side']
      productName = buyObj['body']['product_name']
      gotPriceRest = buyObj['body']['price']
      qnt = buyObj['body']['quantity']
      tradeID = buyObj['body']['order_id']
      statusHttpCode = buyObj['status_code']
      timeOfRequest = buyObj['request_time']
      timeOfResponse = buyObj['response time']
      elapsedTime = buyObj['elapsed_time']

      fs.appendFileSync(dataPath, rowsCounter + ',' + side + ',' + productName + ',' + timeOfRequest + ',' + timeOfResponse + ',' + elapsedTime + ',' + price + ',' + gotPriceRest + ',' + qnt + ',' + j + ',' + tradeID + ',' + timestampPrice + ',' + statusHttpCode + '\n')

      rowsCounter++

      // Json from Web-Socket 
      let webSocketJsonBids = await getJsonWebSocket('bids', ws)
      let priceBids = webSocketJsonBids['bids'][0]['price']
      let timestampPriceBids = webSocketJsonBids['timestamp'].replace("T", " T ").replace("+", " + ").replace("Z", " ")

      let quoteSellPromise = quoteSell(token)
      let sellQuote = await quoteSellPromise

      let sellPromise = tradeSell(token, j, priceBids);
      let sell = await sellPromise;
      console.log(sell)

      // Make it an object 
      sellObj = sell

      // Data infusion from respons post sell
      side = sellObj['body']['side']
      productName = sellObj['body']['product_name']
      gotPriceRest = sellObj['body']['price']
      qnt = sellObj['body']['quantity']
      tradeID = sellObj['body']['order_id']
      statusHttpCode = buyObj['status_code']
      timeOfRequest = sellObj['request_time']
      timeOfResponse = sellObj['response time']
      elapsedTime = sellObj['elapsed_time']

      fs.appendFileSync(dataPath, rowsCounter + ',' + side + ',' + productName + ',' + timeOfRequest + ',' + timeOfResponse + ',' + elapsedTime + ',' + priceBids + ',' + gotPriceRest + ',' + qnt + ',' + j + ',' + tradeID + ',' + timestampPriceBids + ',' + statusHttpCode + '\n')

      rowsCounter++

    }

  }
  ws.send('{"action": "close-connection"}') 
    
  console.log(email = prompt(' What is your email? '))

  sendEmail(email)

  loadCsv()

 // process.exit()

}
)()

//TO DO
//Add cluster for parllel http requests 
//exports.load_csv = ()=> {}
