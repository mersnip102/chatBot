const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true })); // dòng code giúp lấy dữ liệu từ form - body
const bodyParser = require("body-parser"); //đọc nội dung repuest gửi lên dạng post từ người dùng
const cors = require("cors"); // cho phép truy cập từ các domain khác
app.use(bodyParser.json()); //đọc body repuest gửi lên theo cấu trúc json
app.use(bodyParser.urlencoded({ extended: true })); // khi gửi extended = true thg gặp lỗi về ký tự

app.use(cors()); // accept request  cross domain
const PORT = process.env.PORT || 3333;

const dfff = require('dialogflow-fulfillment');

app.get('/', (req, res) => {
    res.send("We are live")
})


app.post("/", (req, res) => {
  const query = req.body.queryResult.queryText;

  const agent = new dfff.WebhookClient({ request: req, response: res });
  const intentMap = new Map();
  const options = { sendAsMessage: true, rawPayload: true };

  core
    .universalSearch({ query })
    .then((results) => {
      let answer = () => {};
      if (results.directAnswer) {
        // highlighting the answer, returning snippet as subtitle

        answer = () => {
          const payloadData = {
            richContent: [
              [
                {
                  type: "info",
                  title: results.directAnswer.value,
                  subtitle: results.directAnswer.snippet.value,
                },
              ],
            ],
          };
          agent.add(
            new dfff.Payload("PLATFORM_UNSPECIFIED", payloadData, options)
          );
        };
      } else {
        answer = () => agent.add("Sorry! I do not have an answer for that!");
      }

      intentMap.set("Default Fallback Intent", answer);

      agent.handleRequest(intentMap);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send(err.message);
    });
});

app.listen(PORT, () => {
    console.log(`Webhook server is listening, port ${PORT}`);
}
  
);