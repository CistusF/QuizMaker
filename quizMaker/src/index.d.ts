interface HistoryHandle {
    date: number;
    settings: {
        size: number;
        quizSize: number;
        falseLimit: number;
        timer: 1800000;
    };
    score: {
        collectAnswer: number;
        wrongAnswer: number;
    };
    false: Boolean;
}
interface QuizHandle {
    name: string | null;
    description: string | null;
    quiz: {
        question: string;
        answer: string;
        hint: string[];
        time: number | null;
    }[];
    defaultTime: number;
    history: {
        date: number;
        settings: {
            size: number;
            quizSize: number;
            falseLimit: number;
            timer: 1800000;
        };
        score: {
            collectAnswer: number;
            wrongAnswer: number;
        };
        false: Boolean;
    }[];
    created: number;
    lastModified: number;
    tried: number;
    perfect: number;
    failure: number;
}
declare class Base {
    name: string | null;
    description: string | null;
    quizList: {
        question: string;
        answer: string;
        hint: string[];
        time: number | null;
    }[];
    defaultTime: number;
    history: {
        date: number;
        settings: {
            size: number;
            quizSize: number;
            falseLimit: number;
            timer: 1800000;
        };
        score: {
            collectAnswer: number;
            wrongAnswer: number;
        };
        false: Boolean;
    }[];
    created: number;
    lastModified: number;
    tried: number;
    perfect: number;
    failure: number;
    setDescription(description: string): this;
    addQuiz(Question: string, Answer: string, Hint: string[], Time: number | null): this;
    removeQuiz(Question: string): this;
    addHistory(Data: HistoryHandle): this;
    setDefaultTime(Time: number): this;
    addCount(Type: "tried" | "perfect" | "failure"): this;
    constructor(data: Base);
}
export declare class QuizPack extends Base {
    setName(name: string): this;
}
export declare function createQuizPack(data: QuizHandle): object;
export declare function editQuizPack(data: QuizPack, options?: {
    oldName?: string;
    type?: "edit" | "save";
}): object;
export declare function saveQuizPack(data: QuizPack): object;
export declare function getQuizPack(name?: string): Base | object;
export declare function deleteQuizPack(name: string): object;
export declare function renameQuizPack(name: string, newName: string): object;
export {};
