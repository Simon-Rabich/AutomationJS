#!/usr/local/bin/node
const axios = require("axios");
const logger = require("./logger");
const WebSocket = require("ws");

const makeRequest = (usr, host) => {
  return new Promise((resolve, reject) => {
    try {
      const config = {
        method: "PUT",
        url: "https://dev.rest-api.enigma-x.io/auth",
        headers: host,
        data: usr,
      };
      axios(config)
        .then((response) => {
          resolve(response.data.token);
        })
        .catch((error) => {
          logger.error(error);
          resolve(error.response.data.resultCode);
        });
    } catch (error) {
      reject(error);
    }
  });
};

const streamRequest = (ws) => {
  return new Promise((resolve, reject) => {
    try {
      ws.on("message", function incoming(data) {
        const obj = JSON.parse(data);
        console.log(obj.content);
        resolve(obj.content);
      });
    } catch (error) {
      logger.info(error);
    }
  });
};

function waitFiveSec(ws) {
  var milliseconds = 5 * 1000;
  if (ws.readyState === WebSocket.OPEN) {
    setTimeout(function () {
      ws.close();
      logger.info("WS is Closed:: The readyState is::" + ws.readyState);
    }, milliseconds);
  }
}

//function injection = self-invoking anonymous function
(async () => {
  const user = { username: "ehilel", password: "12345678" };

  const host = {
    accept: "application/json",
    "Content-Type": "application/json",
    type: "dev",
    // domain: "crypto-company",
  };

  const JWT = await makeRequest(user, host);
  logger.info(JWT);

  const ws = new WebSocket(`wss://dev.ws-api.enigma-x.io/?token=${JWT}`);
  logger.info(
    "Created new instance of WS, the readyState is::" + ws.readyState
  );

  ws.on("open", function open() {
    logger.info("Sent an 'open' event, the readyState is::" + ws.readyState);
    // Payload
    ws.send(
      '{ "type": "subscription", "id": "bf5d15d0-415f-11ec-b255-ad01e0712738", "data" : { "products": ["BTC-USD"], "quantity": "1.0", "level": true, "high": true, "low": true } }'
    );
    waitFiveSec(ws);
  });

  // Dependency Injection - send the websocekt seesion from outside
  const RFS = await streamRequest(ws);
  logger.info(JSON.stringify(RFS));
})();
