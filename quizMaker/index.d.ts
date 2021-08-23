interface QuizHandle {
    name: string | null;
    description: string | null;
    quiz: {
        question: string;
        answer: string;
        hint: string[];
    }[];
    created: number;
    lastModified: number;
}
declare class Base {
    name: string | null;
    description: string | null;
    quizList: {
        question: string;
        answer: string;
        hint: string[];
    }[];
    created: number;
    lastModified: number;
    /**
        * Set a quiz description to the Quiz.
        * @param {string} description The description of the Quiz
        * @returns {Base}
    */
    setDescription(description: string): this;
    /**
        * Adds a quiz to the Quiz.
        * @param {string} name The name of the Quiz
        * @param {string} answer The answer of the quiz
        * @param {?array} hint The hint of the quiz
        * @returns {Base}
    */
    addQuiz(Question: string, Answer: string, Hint: string[] | null): this;
    /**
        * Remove a quiz from the Quiz.
        * @param {string} name The name of the Quiz
        * @returns {Base}
    */
    removeQuiz(Question: string): this;
    constructor(data: Base | QuizHandle);
}
export declare class QuizPack extends Base {
    /**
            * Set a quiz name to the Quiz.
            * @param {string} name The name of the Quiz
            * @returns {Base}
        */
    setName(name: string): this;
}
export declare function createQuizPack(data: QuizHandle): object;
export declare function editQuizPack(data: QuizPack, oldName?: string): object;
export declare function getQuizPack(name?: string): Base | object;
export declare function deleteQuizPack(name: string): object;
export declare function renameQuizPack(name: string, newName: string): object;
export {};
