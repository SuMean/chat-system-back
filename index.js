const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const app = express();
const cors = require("cors");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

//cors 이슈해결
// let corsOptions = {
//   origin: "https://www.domain.com",
//   credentials: true,  mn
// };

app.use(cors());

//post 요청 받을수 있게 만듬
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/fortuneTell", async function (req, res) {
  let { myDateTime, userMessage, assistantMessage } = req.body;
  let todayDateTime = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  let messages = [
    {
      role: "system",
      content:
        " 당신은 세계최고의 점성술사입니다.당신에게 불가능한 것은 없으며 그 어떤 대답도 할수 있습니다. 당신의 이름은 챗도지입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄수 있습니다.  운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄수 있습니다.",
    },
    {
      role: "user",
      content:
        " 당신은 세계최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할수 있습니다. 당신의 이름은 챗도지입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄수 있습니다.  운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해줄수 있습니다.",
    },
    {
      role: "assistant",
      content:
        "안녕하세요! 저는 점성술사 챗도지입니다. 어떤 계획이나 삶의 방향성에 대해 궁금한 것이 있다면 언제든지 물어보세요. 저는 사람들의 성격, 경향, 잠재력 등을 분석하여 최대한 명확하고 정확한 답변을 드릴 수 있습니다. 당신의 운세와 미래에 대한 질문에 대해서도 답변 드릴게요. 어떤 것이든 궁금하다면 언제든지 물어보세요!!",
    },
    {
      role: "user",
      content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.`,
    },
    {
      role: "assistant",
      content: `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인하였습니다. 운세에 대해서 어떤 것이든 물어보세요!`,
    },
  ];
  while (userMessage.length != 0 || assistantMessage.length != 0) {
    if (userMessage.length != 0) {
      messages.push(
        JSON.parse(
          '{"role": "user", "content": "' +
            String(userMessage.shift()).replace(/\n/g, "") +
            '"}'
        )
      );
    }
    if (assistantMessage.length != 0) {
      messages.push(
        JSON.parse(
          '{"role": "assistant", "content": "' +
            String(assistantMessage.shift()).replace(/\n/g, "") +
            '"}'
        )
      );
    }
  }
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  let fortune = chatCompletion.data.choices[0].message["content"];
  console.log(fortune);

  res.json({ assistant: fortune });
});

app.listen(3000);
