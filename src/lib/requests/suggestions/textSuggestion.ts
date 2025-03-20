import { parseJsonWhileHandlingErrors } from "../transformers";

type TextSuggestionParams = {
    text: string;
    auth_token: string;
};

export type TextSuggestion = {
    message: string;
    feedback: string;
    replacement: string;
};

export type TextSuggestionResponse = {
    text: string;
    suggestions: TextSuggestion[];
};

export function textSuggestion({
    text,
    auth_token,
}: TextSuggestionParams): Promise<TextSuggestionResponse> {
    // a place holder Promise that delays for 1 second
    return new Promise((resolve) => {
        const flaggedWords = [
            {
                word: "資工",
                feedback: "快逃",
                replacement: "電機",
            },
            {
                word: "清交小徑",
                feedback: "這個詞可能會引起爭議，建議使用更中立的用語。",
                replacement: "交清小徑",
            },
        ];

        const suggestions: TextSuggestion[] = [];
        let idx = 1;

        flaggedWords.forEach(({ word, feedback, replacement }) => {
            const regex = new RegExp(word, "g"); // Match exact phrase in Chinese
            let match;
            while ((match = regex.exec(text)) !== null) {
                const tag = `<sug${idx}>${match[0]}</sug${idx}>`;
                suggestions.push({
                    message: text.replace(match[0], tag),
                    feedback,
                    replacement,
                });
                idx++;
                return tag;
            }
        });

        setTimeout(() => {
            resolve({ text, suggestions });
        }, 1000);
    });
}
