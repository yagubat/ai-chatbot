require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  const message = req.body.message;
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: '메시지를 입력해주세요.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: message }],
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI 응답을 가져오는 중 오류가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});
