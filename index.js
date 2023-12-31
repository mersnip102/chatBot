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

app.post('/', express.json(), async (req, res)=>{
    const agent = new dfff.WebhookClient({
        request : req,
        response : res
    });

    function demo(agent){
        agent.add("Sending response from Webhook server as v1.1.11.1");
    }
    async function customPayloadDemo(agent){
        var payloadData = {
            "richContent": [
              [
                {
                  "type": "accordion",
                  "title": "Accordion title",
                  "subtitle": "Accordion subtitle",
                  "image": {

                    "src": {
                      "rawUrl": "https://example.com/images/logo.png"
                    }
                  },
                  "text": "Accordion text"
                }
              ]
            ]
          }

          await agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true }))
    }

    // function finalConfirmation(agent){
    //   var name = agent.context.get("awaiting_name").parameters['given-name'];
    //   var email = agent.context.get("awaiting_email").parameters.email;

    //   console.log(name);
    //   console.log(email);


      

    //   agent.add(`Hello ${name}, your email: ${email}. We confirmed your meeting.`);

    //   return db.collection('meeting').add({
    //     name : name,
    //     email : email,
    //     time : Date.now()
    //   }).then(ref =>

    //     //fetching free slots from G-cal
    //     console.log("Meeting details added to DB")
    //     )

    // }


    var intentMap = new Map();
    // intentMap.set('finalConfirmation', finalConfirmation)
    intentMap.set('webhookDemo',demo )
    intentMap.set('customPayloadDemo', customPayloadDemo)
    

    await agent.handleRequest(intentMap);

});

app.listen(PORT, () => {
    console.log("Server is running, port 3333")
})