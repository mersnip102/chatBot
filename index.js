const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true })); // dòng code giúp lấy dữ liệu từ form - body
const bodyParser = require("body-parser"); //đọc nội dung repuest gửi lên dạng post từ người dùng
const cors = require("cors"); // cho phép truy cập từ các domain khác
app.use(bodyParser.json()); //đọc body repuest gửi lên theo cấu trúc json
app.use(bodyParser.urlencoded({ extended: true })); // khi gửi extended = true thg gặp lỗi về ký tự

app.use(cors()); // accept request  cross domain
// app.options('*', cors())
const PORT = process.env.PORT || 3333;

const dfff = require('dialogflow-fulfillment');

app.get('/', (req, res) => {
    res.send("We are live")
})

app.post('/', async (req, res) => {
    
    const agent = await new dfff.WebhookClient({
        request: req,
        response: res
    })
    async function demo(agent) {
        await agent.add("Sending response from Webhook server")
    }

    async function customPayloadDemo(agent) {
        var payloadData = {
            "richContent": [
              [
                {
                  "type": "accordion",
                  "title": "Accordion title",
                  "subtitle": "Accordion subtitle",
                  "image": {
                    "src": {
                      "rawUrl": "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
                    }
                  },
                  "text": "Accordion text"
                }
              ]
            ]
          }
        //    agent.add(new dfff.Payload('PLATFORM_UNSPECIFIED', payloadData, {sendAsMessage: true, rawPayload: true}))
           await agent.add(
            new dfff.Payload("PLATFORM_UNSPECIFIED", payloadData, {rawPayload: true, sendAsMessage: true})
          );
          
    }

    var intentMap = new Map();
     intentMap.set("webhookDemo", demo)
     
    
     intentMap.set("customPayloadDemo", customPayloadDemo(agent))
    
    
    await agent.handleRequest(intentMap)
})

app.listen(PORT, () => {
    console.log("Server is running, port 3333")
})