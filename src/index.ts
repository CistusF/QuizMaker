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
};


//#region Classes

class Base {
    public name: string | null;
    public description: string | null;
    public quizList: {
        question: string;
        answer: string;
        hint: string[];
        time: number | null;
    }[];
    public defaultTime: number;
    public history: {
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
    public created: number;
    public lastModified: number;
    public tried: number;
    public perfect: number;
    public failure: number;

    public setDescription(description: string): this {
        if (!description) throw new Error("description is required");
        this.description = description;
        return this;
    };

    public addQuiz(Question: string, Answer: string, Hint: string[], Time: number | null): this {
        if (!Question) throw new Error("Question is required");
        if (!Answer) throw new Error("Answer is required");
        let filter = this.quizList.filter(i => i.question === Question);
        if (filter.length !== 0) throw new Error(`${Question} is already in the quiz`);
        this.quizList.push({
            question: Question,
            answer: Answer,
            hint: Hint ?? [],
            time: Time ?? null
        });
        return this
    };

    public removeQuiz(Question: string): this {
        if (!Question || !this.quizList.find(i => i.question == Question)) throw new Error("quiz is required");
        let Index = this.quizList.findIndex(i => i.question == Question);
        if (Index < -1) throw new Error(`${Question} is not defined`);
        this.quizList.splice(Index, 1);
        return this
    };

    public addHistory(Data: HistoryHandle): this {
        if (!Data.date) throw new Error("data is required");
        if (!Data.settings?.size) throw new Error("size in settings is required");
        if (!Data.settings?.quizSize) throw new Error("quizSize in settings is required");
        if (!Data.settings?.falseLimit) throw new Error("falseLimit in settings is required");
        if (!Data.settings?.timer) throw new Error("timer in settings is required");
        if (!Data.score?.collectAnswer) throw new Error("collectAnswer in score is required");
        if (!Data.score?.wrongAnswer) throw new Error("wrongAnswer in score is required");
        if (typeof Data.false != "boolean") throw new Error("false is required");
        this.history.push(Data);
        return this;
    };

    public setDefaultTime(Time: number): this {
        if (!Time) throw new Error("Time is required");
        this.defaultTime = Time;
        return this;
    };

    public addCount(Type: "tried" | "perfect" | "failure"): this {
        if (this.created == null) throw new Error("You can use this function after create QuizkPack DataFile");
        this[Type]++;
        return this;
    }

    // public addTried(): this {
    //     if (this.created == null) throw new Error("You can use this function after create QuizkPack DataFile");
    //     this.tried++;
    //     return this;
    // }

    // public addPerfect(): this {
    //     if (this.created == null) throw new Error("You can use this function after create QuizkPack DataFile");
    //     this.perfect++;
    //     return this;
    // }

    // public addFailure(): this {
    //     if (this.created == null) throw new Error("You can use this function after create QuizkPack DataFile");
    //     this.failure++;
    //     return this;
    // }

    constructor(data: Base) {
        //# handle Date
        const date: number = new Date().getTime();

        this.name = data?.name ?? null;

        this.description = data?.description ?? null;

        this.quizList = [];

        this.defaultTime = data?.defaultTime;

        this.history = [];

        this.created = data?.created;

        this.lastModified = date;

        this.tried = data?.tried;

        this.perfect = data?.perfect;

        this.failure = data?.failure;
    };
};


export class QuizPack extends Base {

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

export function editQuizPack(data: QuizPack, options?: { oldName?: string, type?: "edit" | "save" }): object {
    try {
        if (!data.name) throw new Error("Quiz name is required");
        let name = options?.oldName ?? data.name
        let file = fileCheck(name);
        if (file.status === 409) throw new Error(`QuizPack name ${name} is not defined`);
        if (options?.type === "save") {
            data.lastModified = new Date().getTime();
        }
        writeFileSync(`./QuizData/${name}.json`, JSON.stringify(data));
        return { status: 200, message: `Success to edit ${name}` };
    } catch (e: any) {
        return sendMessage(409, e);
    }
};

export function saveQuizPack(data: QuizPack): object {
    try {
        if (!data.name) throw new Error("Quiz name is required");
        let file = fileCheck(data.name);
        if (file.status === 409) throw new Error(`QuizPack name ${data.name} is not defined`);
        writeFileSync(`./QuizData/${data.name}.json`, JSON.stringify(data));
        return { status: 200, message: `Success to save ${data.name}` };
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
        editQuizPack(pack, { oldName: name });
        renameSync("./QuizData/" + name + ".json", "./QuizData/" + newName + ".json");
        return sendMessage(200, "Success to rename " + name + " to " + newName);
    } catch (e: any) {
        return sendMessage(409, e);
    }
};