// {
//   deviceId: '',
//   windSpeed: '',
//   temperature: '',
//   dust: '',
//   ultrafine: '',
//   dustB: '',
//   dustC: '',
//   dustD: '',
//   rgstDt: ''
// }

const net_server = require('net');
const connection = require("./connection");
 
const server = net_server.createServer((client) => {
  console.log('Client connection: ');
  console.log('   local = %s:%s', client.localAddress, client.localPort);
  console.log('   remote = %s:%s', client.remoteAddress, client.remotePort);
  
  client.setTimeout(500);
  client.setEncoding('utf8');
  
  client.on('data', (data) => {
    console.log('Received data from client on port %d: %s', client.remotePort, data.toString());
    
    const json = JSON.parse(data);
    const query = `INSERT INTO finedust_tb(device_id, wind_speed, temperature, dust, ultrafine, dustB, dustC, dustD, rgst_dt) VALUES 
                   (${json.deviceId}, ${json.windSpeed}, ${json.temperature}, ${json.dust}, ${json.ultrafine}, ${json.dustB}, ${json.dustC}, ${json.dustD}, "${json.rgstDt}")`;

    connection.query(query, (err, rows, fields) => {
      if (err) {
        console.log(err);
      }
    })
  });
  
  client.on('end', () => {
    console.log('Client disconnected');
  });
  
  client.on('error', (err) => {
    console.log('Socket Error: ', JSON.stringify(err));
  });
  
  client.on('timeout', () => {
    console.log('Socket Timed out');
  });
});

const writeData = (socket, data) => {
  const success = socket.write(data);
  if (!success){
    console.log("Client Send Fail");
  }
}

module.exports = server;