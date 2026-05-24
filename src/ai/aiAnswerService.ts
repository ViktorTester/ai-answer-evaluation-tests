import {createOpenAiClient} from "./openAiClient";

export class AiAnswerService {
    private readonly client = createOpenAiClient();

    async getAnswer(prompt: string): Promise<string> {
        const model = process.env.OPENAI_MODEL ?? "gpt-5.2";

        const response = await this.client.responses.create({
            model,
            input: prompt,
        });

        const answer = response.output_text?.trim();
        console.log("AI answer:", answer);

        if (!answer) {
            throw new Error("AI response is empty.");
        }

        return answer;
    }
}