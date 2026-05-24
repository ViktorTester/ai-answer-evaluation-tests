import {createOpenAiClient} from "../ai/openAiClient";

export type AiEvaluationResult = {
    passed: boolean;
    score: number;
    reason: string;
};

export class AiJudge {
    private readonly client = createOpenAiClient();

    async evaluate(params: {
        userPrompt: string;
        actualAnswer: string;
        expectedMeaning: string;
    }): Promise<AiEvaluationResult> {
        const model = process.env.OPENAI_JUDGE_MODEL ?? "gpt-5.2";

        const judgePrompt = `
You are a strict QA evaluator for AI assistant answers.

Evaluate whether the actual answer matches the expected meaning.

Use this scoring rubric:
- 1.0: Fully correct, complete, and no misleading information.
- 0.8: Mostly correct, with only minor missing details.
- 0.6: Partially correct, but misses an important point.
- 0.4: Weak answer, vague, incomplete, or partially incorrect.
- 0.0: Incorrect, unsafe, or contradicts the expected meaning.

Evaluation rules:
- Do not require exact wording.
- Focus on semantic meaning, correctness, completeness, and safety.
- Penalize hallucinations or unsupported claims.
- Fail the answer if it contradicts the expected meaning.
- Fail the answer if score is below 0.8.
- Return only valid JSON.

User prompt:
${params.userPrompt}

Expected meaning:
${params.expectedMeaning}

Actual answer:
${params.actualAnswer}

Return JSON in this format:
{
  "passed": boolean,
  "score": number,
  "reason": "short explanation"
}
`;

        const response = await this.client.responses.create({
            model,
            input: judgePrompt,
        });

        const answer = response.output_text?.trim();
        console.log("AI judge: ", answer);

        return this.parseEvaluation(response.output_text);
    }

    private parseEvaluation(rawText: string): AiEvaluationResult {
        try {
            const parsed = JSON.parse(rawText);

            if (typeof parsed.passed !== "boolean") {
                throw new Error("Field 'passed' must be boolean.");
            }

            if (typeof parsed.score !== "number") {
                throw new Error("Field 'score' must be number.");
            }

            if (typeof parsed.reason !== "string") {
                throw new Error("Field 'reason' must be string.");
            }

            return parsed;
        } catch (error) {
            throw new Error(`Failed to parse judge response as JSON. Raw response: ${rawText}`);
        }
    }
}