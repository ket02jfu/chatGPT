import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { OPENAI_API_KEY } from '../utils/globalVariables'

import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${OPENAI_API_KEY}`
};

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from VAM!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0
      })
    });

    const result = await response.json();

    res.status(200).send({
      bot: result.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
});

app.listen(5000, () => console.log('AI server started on https://vamgpt.onrender.com'))