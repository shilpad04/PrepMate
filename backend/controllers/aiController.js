const axios = require("axios");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompts");

// Generate interview questions and answers
// POST /api/ai/generate-questions
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
          "HTTP-Referer": "http://localhost:8000",
          "X-Title": "InterviewPrepAI",
        },
      }
    );

    // ✅ Safe access (prevents crash)
    const rawText = response?.data?.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(500).json({
        message: "Empty response from AI",
      });
    }

    // Clean AI response
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    let data;

    try {
      data = JSON.parse(cleanedText);
    } catch (err) {
      // ✅ Fallback instead of failing completely
      return res.status(200).json({
        warning: "AI did not return valid JSON",
        raw: cleanedText,
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.log("FULL ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Failed to generate questions",
      error: error.response?.data || error.message,
    });
  }
};

// Generate explanation
// POST /api/ai/generate-explanation
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
        model: "openrouter/auto", // ✅ safest model
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
          "HTTP-Referer": "http://localhost:8000",
          "X-Title": "InterviewPrepAI",
        },
      }
    );

    const rawText = response?.data?.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(500).json({
        message: "Empty response from AI",
      });
    }

    // Clean AI response
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    let data;

    try {
      data = JSON.parse(cleanedText);
    } catch (err) {
      return res.status(200).json({
        warning: "AI did not return valid JSON",
        raw: cleanedText,
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.log("FULL ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Failed to generate explanation",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};