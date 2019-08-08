const fs = require('fs')

exports.fetchEndpoints = (cb) => {
   fs.readFile('./endpoints.json', utf8, (err, data) => {
       if(err) console.log(err)
       else console.log(data)
   })
    
    
}