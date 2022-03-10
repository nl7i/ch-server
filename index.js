const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const WebSocket = require("ws");

/*Middlewares*/
app.use(cors());

/*Module*/
const checker = require("./checker");

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    const parsedData = JSON.parse(data);
    const SK = parsedData.sk;
    const card = parsedData.card.replace().split("|");
    
    const result = await checker(SK, card);
    result.card = parsedData.card;
    ws.send(JSON.stringify(result));
  });
});

server.listen(8080, () => console.log("Running on port 8080"));