const axios = require("axios");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompts");

// Generate interview questions and answers
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/auto",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "InterviewPrepAI",
        },
      }
    );

    const rawText = response?.data?.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(200).json([]);
    }

    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    let data = [];

    try {
      const parsed = JSON.parse(cleanedText);

      if (Array.isArray(parsed)) {
        data = parsed;
      } else if (Array.isArray(parsed.questions)) {
        data = parsed.questions;
      } else {
        data = [];
      }
    } catch (err) {
      data = [
        {
          question: `Explain the core concepts of ${topicsToFocus}`,
          answer:
            "Focus on fundamentals, key concepts, and practical use cases. Structure your answer clearly with examples where possible.",
        },
      ];
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log("AI ERROR:", error.response?.data || error.message);

    return res.status(200).json([
      {
        question: "Explain a core concept related to your selected topic.",
        answer:
          "Revise the fundamentals, provide a structured explanation, and include examples for clarity.",
      },
    ]);
  }
};

// Generate explanation
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/auto",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "InterviewPrepAI",
        },
      }
    );

    const rawText = response?.data?.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(200).json({
        title: "Concept Explanation",
        explanation: "Unable to generate explanation at the moment.",
        answerTips: [],
        quickNotes: [],
      });
    }

    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    let data = {};

    try {
      data = JSON.parse(cleanedText);
    } catch (err) {
      data = {
        title: "Concept Explanation",
        explanation: cleanedText,
        answerTips: [],
        quickNotes: [],
      };
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log("AI ERROR:", error.response?.data || error.message);

    return res.status(200).json({
      title: "Concept Explanation",
      explanation: "Unable to generate explanation at the moment.",
      answerTips: [],
      quickNotes: [],
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};