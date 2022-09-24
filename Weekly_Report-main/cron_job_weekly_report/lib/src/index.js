#!/usr/local/bin/node

let config = require('./config')
require('events').EventEmitter.defaultMaxListeners = 3000
let { getMaxListeners } = require('process')
const { EventEmitter } = require('stream')
let WebSocket = require('ws')
let request = require('request')
const fs = require('fs')
const nodemailer = require('nodemailer')
let format = require('date-fns/format')
const fsPromises = require('fs').promises 

//functions returns a Promise

console.log('hello test row 0 ')

function getJsonWebSocket(dir) {
  return new Promise((resolve, reject) => {
    try {
      // Node streams API
      let ws = new WebSocket('wss://.../')
      
     // let duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' })
     // duplex.pipe(process.stdout)
      //process.stdin.pipe(duplex)

      ws.on('open', function open() {
      console.log('hello test row 1 ')
        ws.send(config.WSS.btc) 
      })

      responseCounter = 0

      ws.on('message', function incoming(data) {
        // Extract the values from the obj
        const obj = JSON.parse(data)
        if (responseCounter > 6) {
          if (obj[dir] && obj[dir][0]) {
              ws.send('{"action": "close-connection"}') 
            resolve(obj)
          }
        }
        responseCounter++
      })
    } catch (error) { reject(error); }
  })
}

function putToken() {
  return new Promise((resolve, reject) => {
    let options = {
      'method': config.VERB.put,
      'url': 'https://sandbox.rest-api.io/auth',
      'headers': {},

      form: {
        'username': config.cerd.user,
        'password': config.cerd.pass
      }
    }

    request(options, (error, response) => {
      console.log('hello test row 3')
      if (error) reject(error);
      resolve(JSON.parse(response.body)['key']) // return
    })
  })
}

/*function postQuoteBuy(token) {
  return new Promise((resolve, reject) => {
    let options = {
      'method': 'POST',
      'url': 'https://sandbox.rest-api.io/quote',
      'headers': {
        'Authorization':token,
      },
      formData: {
        'side': 'BUY',
        'product_id': '2', 
        'quantity': '1'
      }
    };
    request(options, (err, res) => {
      if (err) reject(err);
      resolve(JSON.parse(res.body)['price'])  
    });
  });
}*/

/*function postQuoteSell(token) {
  return new Promise((resolve, reject) => {
    let options = {
      'method': 'POST',
      'url': 'https://sandbox.rest-api.io/quote',
      'headers': {
        'Authorization':token,
      },
      formData: {
        'side': 'SELL',
        'product_id': '2', 
        'quantity': '1'
      }
    };
    request(options, (err, res) => {
      if (err) reject(err);
      resolve(JSON.parse(res.body)['price'])  
    });
  });
}*/

function postBuy(token, j, price) { 
  let start1 = new Date()
  start = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx").replace("T", " ").replace("+", " ")
  console.log('hello test row 4 ')
  return new Promise((resolve, reject) => {

    let options = {
      'method': config.VERB.post,
      'url': config.URI,
      'time' : true,
      'headers': {
        'Authorization': token
      },

      formData: {
        'type': config.TYPE.fok,
        'side': config.SIDE.buy,
        'product_id':config.PRODUCT.id,
        'quantity': config.QUANTITY.qnt,
        'price': price, 
        'slippage': j

      }
    }

    request(options, (err, res) => {

      end = new Date()
      res.resTime = new Date() - start1
      restime = res.resTime
      duration = res.elapsedTime
      timeResponseOfBuyTrade = res.headers.date.replace(",", "").timeResponseOfBuyTrade = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx").replace("T", " ").replace("+", " ")
      validation =  res.headers.date

      if (err) reject(err)
      resolve({ "status_code": res.statusCode, "request_time": start, "response time": timeResponseOfBuyTrade, "elapsed_time": res.elapsedTime, "body": JSON.parse(res.body)})  

    })

  })

}

function postSell(token, j, price) { 
  let start2 = new Date()
  start = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx").replace("T", " ").replace("+", " ")
  return new Promise((resolve, reject) => {

    let options = {
      'method': config.VERB.post,
      'url': config.URI,
      'time' : true,
      'headers': {
        'Authorization': token
      },

      formData: {
        'type': config.TYPE.fok,
        'side': config.SIDE.sell,
        'product_id':config.PRODUCT.id,
        'quantity': config.QUANTITY.qnt,
        'price': price,
        'slippage': j
      }
    }
    
    request(options, (err, res) => {
      
       res.resTime = new Date() - start2
       end = new Date()
       restimee= res.resTime
       duration = res.elapsedTime
       timeResponseOfTrade = res.headers.date.replace(",", "").timeResponseOfTrade = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx").replace("T", " ").replace("+", " ")
       response_time=  res.headers.date

      if (err) reject(err)
      resolve({ "status_code": res.statusCode, "request_time": start, "response time": timeResponseOfTrade, "elapsed_time": res.elapsedTime, "body": JSON.parse(res.body)})
    })
  })
}

// anonymous async function to execute some code synchronously 

(async  () => {

  dataPath = 'data.csv'

  try { fs.unlinkSync(dataPath) } catch (err) { }

  let tokenPromise = putToken()
  let token = await tokenPromise

  // Headers                                                                                                                    
  fs.appendFileSync(dataPath, 'row_num' + ',' + 'side' + ',' + 'product_name' + ',' + 'request_time' + ',' + 'response_time' + ',' + 'elapsed_time_ms'  + ',' + 'websocket_price' + ',' + 'execute_price' + ',' + 'quantity' + ',' + 'slippage'  + ',' + 'trade_id' + ',' +  'timestamp_ws_tick' + ',' + 'http_code' + '\n')

  fsPromises.chmod( dataPath, 0o777 )

  let rowsCounter = 1

  for (let index = 0; index <= 50; index++) {

    for (let j = 0; j <= 5; j++) {

      // Json from Web-Socket 
      let webSocketJson = await getJsonWebSocket('asks')
      let price = webSocketJson['asks'][0]['price']
      let timestampPrice = webSocketJson['timestamp'].replace("T"," T ").replace("+"," + ").replace("Z"," ")

    /*let quoteBuyPromise = postQuoteBuy(token)
      let buyQuote = await quoteBuyPromise
      let createdAt = quoteBuyPromise['created_at']*/

      let buyPromise = postBuy(token, j, price) 
      let buy = await buyPromise

      //console.log(buy)

      // Make it an object 
      buyObj = buy

      // Data infusion from respons post trade buy
      side = buyObj['body']['side']
      productName = buyObj['body']['product_name']
      gotPriceRest = buyObj['body']['price']
      qnt = buyObj['body']['quantity']
      tradeID = buyObj['body']['order_id']
      statusHttpCode = buyObj['status_code']
      timeOfRequest = buyObj['request_time']
      timeOfResponse = buyObj['response time'] 
      elapsedTime = buyObj['elapsed_time']
                                                                                                                                                    
      fs.appendFileSync(dataPath, rowsCounter + ',' + side + ',' + productName + ',' + timeOfRequest + ',' + timeOfResponse + ',' + duration + ',' + price + ',' + gotPriceRest + ',' + qnt + ',' +  j + ',' + tradeID + ',' + timestampPrice + ',' + statusHttpCode + '\n')
      rowsCounter++
console.log('hello test row 5 ')
      // Json from Web-Socket 
      let webSocketJsonBids = await getJsonWebSocket('bids')
      let priceBids = webSocketJsonBids['bids'][0]['price']
      let timestampPriceBids = webSocketJsonBids['timestamp'].replace("T"," T ").replace("+"," + ").replace("Z"," ")

      /*let quoteSellPromise = postQuoteSell(token)
      let sellQuote = await quoteSellPromise
      let createdAtt = quoteSellPromise['created_at']*/

      let sellPromise = postSell(token, j, priceBids) 
      let sell = await sellPromise

      //console.log(sell)

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
                                                                                                                                                       
      fs.appendFileSync(dataPath, rowsCounter + ',' +  side + ',' + productName + ',' + timeOfRequest + ',' + timeOfResponse + ',' + duration + ',' +  priceBids + ',' + gotPriceRest + ',' + qnt + ',' + j + ',' +  tradeID + ',' + timestampPriceBids + ',' + statusHttpCode + '\n')

      rowsCounter++
    
    }
    
  }

  // email SMPT POP3
  let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'srabich@makor-capital.com',
      pass: 'Sac67606'
    }
  })

  let message = {
    from: "sr@",
    to: "@@@",
    subject: "Statistics - [External ec2]", 
    html: "<b>Ola! Please check the attachment for a surprise! 😊<b>",
    attachments: [
      {
        filename: dataPath,
        content: fs.createReadStream(dataPath)
      }
    ]

  }

  transporter.sendMail(message, function (err, info) {

    if (err) {console.log(err)
    
    } else {

      console.log('\nHTTP requests has done!',"\nEmail has sent\n!") //info.messageId || .response

    }  

          process.exit()

  })
}

)()




