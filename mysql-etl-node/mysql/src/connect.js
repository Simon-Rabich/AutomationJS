const mysql = require("mysql");

function connect_to_db() {

   // create a new connection to the database
   const connection = mysql.createConnection({
    host: "localhost",
    user: "appuser",
    password: "1qaz@WSX3edc",
    database: "mydb"
  });

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

}

module.exports = {

  connect_to_db

}

//-------------------------------------------------------------------------------------------------------
/*function initializeConnection(config) {
    function addDisconnectHandler(connection) {
        connection.on("error", function (error) {
            if (error instanceof Error) {
                if (error.code === "PROTOCOL_CONNECTION_LOST") {
                    console.error(error.stack);
                    console.log("Lost connection. Reconnecting...");

                    initializeConnection(connection.config);
                } else if (error.fatal) {
                    throw error;
                }
            }
        });
    }

    var connection = mysql.createConnection(config);

    // Add handlers.
    addDisconnectHandler(connection);

    connection.connect();
    return connection;
}

module.exports = initializeConnection;*/
 
//-----------------------------------------------------------------------------------------

      // CONNECTION

var con = mysql.createConnection({
  host: "localhost",
  user: "appuser",
  password: "1qaz@WSX3edc",
  database: "mydb"
});
        // CONNECT
  con.connect((err) => {
  if (err) return console.error(
          'error: ' + err.message);
  });

        // CONNECT
/*con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});*/

      // CREATE table 
 var sql = "CREATE TABLE trades2 (row_num INT, side VARCHAR(255), product_name VARCHAR(255), request_time VARCHAR(255), response_time VARCHAR(255), elapsed_time_ms VARCHAR(255), quote_price VARCHAR(255), execute_price VARCHAR(255), quantity VARCHAR(255), slippage VARCHAR(255), trade_id VARCHAR(255), timestamp_quote_tick VARCHAR(255), http_code VARCHAR(255))";
   con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Table created");
  });

          // SELECT
/*con.query("SELECT * FROM customers", function (err, result, fields) {
if (err) throw err;
console.log(result);
});
}); */
         // INSERT
/* var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
 con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("1 record inserted");
 });
});
*/
          // DROP
/*var sql = "DROP TABLE customers";
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Table deleted");
});
});*/



        // Terminated 
//con.end(function(err) {});
//or
//connection.destroy();
