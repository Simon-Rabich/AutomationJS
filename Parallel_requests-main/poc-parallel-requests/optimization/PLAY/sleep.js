

function delayedLog(index, delay){
    setTimeout(function(){ 
      console.log("Logging from function call #"+index)
    }, delay)
  }
  
  delayedLog(1, 2000)
  delayedLog(2, 1000)

