import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync, renameSync } from "fs";


//# handle when data folder is not defined
(() => {
    if (!existsSync("./QuizData")) mkdirSync("QuizData");
})();


//#region Interfaces


interface Message {
    status: number;
    message: string;
}


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
};


//#region Classes

class Base {
    public name: string | null;
    public description: string | null;
    public quizList: {
        question: string;
        answer: string;
        hint: string[];
    }[];
    public created: number;
    public lastModified: number;


    /**
        * Set a quiz description to the Quiz.
        * @param {string} description The description of the Quiz
        * @returns {Base}
    */

    public setDescription(description: string): this {
        if (!description) throw new Error("description is required");
        this.description = description;
        return this;
    };
    /**
        * Adds a quiz to the Quiz.
        * @param {string} name The name of the Quiz
        * @param {string} answer The answer of the quiz
        * @param {?array} hint The hint of the quiz
        * @returns {Base}
    */

    public addQuiz(Question: string, Answer: string, Hint: string[] | null): this {
        if (!Question) throw new Error("Question is required");
        if (!Answer) throw new Error("Answer is required");
        let filter = this.quizList.filter(i => i.question === Question);
        if (filter.length !== 0) throw new Error(`${Question} is already in the quiz`);
        this.quizList.push({
            question: Question,
            answer: Answer,
            hint: Hint ?? []
        });
        return this
    };
    /**
        * Remove a quiz from the Quiz.
        * @param {string} name The name of the Quiz
        * @returns {Base}
    */

    public removeQuiz(Question: string): this {
        if (!Question || !this.quizList.find(i => i.question == Question)) throw new Error("quiz is required");
        let Index = this.quizList.findIndex(i => i.question == Question);
        if (Index < -1) throw new Error(`${Question} is not defined`);
        this.quizList.splice(Index, 1);
        return this
    };

    constructor(data: Base | QuizHandle) {
        //# handle Date
        const date: number = new Date().getTime();

        /**
            * The name of this Quiz
            * @type {?string}
        */

        this.name = data?.name ?? null;
        /**
            * The description of this Quiz
            * @type {?string}
        */

        this.description = data?.description ?? null;
        /**
            * Represents a quiz list
            * @typedef {Object} Base
            * @property {string} Quiz The quiz of this Quiz
            * @property {string} Answer The answer of this Quiz
            * @property {?array} Hint The hint of this Quiz
        */

        /**
            * The quiz list of this Quiz
            * @type {array}
        */
        this.quizList = [];

        /**
            * The creation date of Quiz
            * @type {number}
        */
        this.created = data?.created;

        /**
            * The last revision date of Quiz
            * @type {number}
        */
        this.lastModified = date;
    };
};


export class QuizPack extends Base {
    /**
            * Set a quiz name to the Quiz.
            * @param {string} name The name of the Quiz
            * @returns {Base}
        */

    public setName(name: string): this {
        if (!name) throw new Error("name is required");
        this.name = name;
        return this
    };
};


//# functions for using in module


function sendMessage(status: number, message: string): Message {
    return { status: status, message: message };
};


function fileCheck(name: string): Message {
    try {
        let path = "./QuizData/" + name + ".json"
        let handle = existsSync(path);
        if (!handle) return sendMessage(409, "Quiz name " + name + " is not defined");
        let data = readFileSync(path, "utf-8");
        return sendMessage(200, data);
    } catch (e: any) {
        return sendMessage(409, e);
    };
};

//# functions for User using


export function createQuizPack(data: QuizHandle): object {
    try {
        let date = new Date().getTime();
        if (!data.name) throw new Error("QuizPack name is required");
        let file = fileCheck(data.name);
        if (file.status === 200) throw new Error(`QuizPack name ${data.name} is already created`);
        data.created = date;
        data.lastModified = date;
        writeFileSync(`./QuizData/${data.name}.json`, JSON.stringify(data));
        return sendMessage(200, `Success to create ${data.name}`);
    } catch (e: any) {
        return sendMessage(409, e);
    }
};

export function editQuizPack(data: QuizPack, oldName?: string): object {
    try {
        if (!data.name) throw new Error("Quiz name is required");
        let name = oldName ?? data.name
        let file = fileCheck(name);
        if (file.status === 409) throw new Error(`QuizPack name ${name} is not defined`);
        data.lastModified = new Date().getTime();
        writeFileSync(`./QuizData/${name}.json`, JSON.stringify(data));
        return { status: 200, message: `Success to edit ${name}` };
    } catch (e: any) {
        return sendMessage(409, e);
    }
};

export function getQuizPack(name?: string): Base | object {
    try {
        let datas = readdirSync("./QuizData").filter(i => i.includes(".json"));
        if (!name) return datas;
        let data = fileCheck(name);
        return new Base(JSON.parse(data.message));
    } catch (e: any) {
        return sendMessage(409, e);
    }
}

export function deleteQuizPack(name: string): object {
    try {
        let handle = fileCheck(name);
        if (handle.status === 409) return handle;
        unlinkSync("./QuizData/" + name + ".json");
        return sendMessage(200, `Success to delete ${name}`);
    } catch (e: any) {
        return sendMessage(409, e);
    }
}

export function renameQuizPack(name: string, newName: string): object {
    try {
        if (!name) throw new Error("name is required");
        if (!newName) throw new Error("newName is required");
        let data = fileCheck(name);
        let pack = new QuizPack(JSON.parse(data.message));
        pack.setName(newName);
        editQuizPack(pack, name);
        renameSync("./QuizData/" + name + ".json", "./QuizData/" + newName + ".json");
        return sendMessage(200, "Success to rename " + name + " to " + newName);
    } catch (e: any) {
        return sendMessage(409, e);
    }
};