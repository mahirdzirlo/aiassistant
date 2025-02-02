import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import Together from "together-ai";

dotenv.config();

const together = new Together();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Coding Assistant!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
      max_tokens: null,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
      stream: true,
    });
    let text = "";
    for await (const token of response) {
      text += token.choices[0]?.delta?.content;
    }

    res.status(200).send({
      bot: text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
