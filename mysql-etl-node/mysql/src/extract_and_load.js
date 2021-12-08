const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");

function load_from_csv() {

  let stream = fs.createReadStream("data.csv");
  let csvData = [];
  let csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      csvData.push(data);
    })
    .on("end", function () {
      // remove the first line: header
      csvData.shift();

      // create a new connection to the database
      const connection = mysql.createConnection({
        host: "localhost",
        user: "appuser",
        password: "1qaz@WSX3edc",
        database: "mydb"
      });

      // open the connection
      connection.connect(error => {
        if (error) {
          console.error(error);
        } else {
          let query =
            "INSERT INTO trades (row_num, product_name, side, request_time, response_time, elapsed_time_ms, quote_price, execute_price, quantity, slippage, trade_id, http_code) VALUES ?";
          connection.query(query, [csvData], (error, response) => {
            console.log(error || response);
          });
        }
      });
    });

  stream.pipe(csvStream);

}

module.exports = {

  load_from_csv

}
