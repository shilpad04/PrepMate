const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `
You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Write ${numberOfQuestions} interview questions.
- For each question, generate a detailed but beginner-friendly answer.
- If needed, include a code example.

Formatting Rules:
- Keep formatting clean and readable.
- Use short paragraphs (not one long block).
- If including code:
  - Use markdown code blocks
  - IMPORTANT: Escape backticks like this: \\\`\\\`\\\`
  - Example:

  \\\`\\\`\\\`javascript
  console.log("Hello World");
  \\\`\\\`\\\`

Return strictly as JSON:

[
  {
    "question": "Question here",
    "answer": "Answer here."
  }
]

Strict JSON Rules:
- Output must be valid JSON
- No trailing commas
- Escape all double quotes properly
- Do not include any text outside JSON

Important:
- DO NOT add explanations outside JSON
- ONLY return valid JSON
`;

const conceptExplainPrompt = (question) => `
You are an AI trained to explain programming concepts clearly.

Task:
- Explain the following interview question in depth for a beginner developer.
- Question: ${question}
- After explanation, provide a short title.
- Provide 2-3 tips on how to answer this question confidently in a real interview.
- Provide 2-3 quick notes — easy bite-sized facts about this topic to remember.

Formatting Rules:
- Use simple, beginner-friendly language.
- Use short paragraphs for readability.
- If including code:
  - Use markdown code blocks
  - Escape backticks like this: \\\`\\\`\\\`

Return strictly as JSON:

{
  "title": "Short title here",
  "explanation": "Explanation here.",
  "answerTips": [
    "Tip on how to answer confidently in interview 1",
    "Tip on how to answer confidently in interview 2"
  ],
  "quickNotes": [
    "Easy bite-sized fact to remember 1",
    "Easy bite-sized fact to remember 2"
  ]
}

Strict JSON Rules:
- Output must be valid JSON
- No trailing commas
- Escape quotes properly
- Do not include anything outside JSON

Important:
- answerTips: practical advice on what to say, what to highlight, what to avoid in the interview
- quickNotes: short memorable facts about the topic itself, like a cheat sheet
- ONLY return valid JSON
`;

module.exports = {
  questionAnswerPrompt,
  conceptExplainPrompt,
};