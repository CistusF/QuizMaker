"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameQuizPack = exports.deleteQuizPack = exports.getQuizPack = exports.saveQuizPack = exports.editQuizPack = exports.createQuizPack = exports.QuizPack = void 0;
var fs_1 = require("fs");
//# handle when data folder is not defined
(function () {
    if (!fs_1.existsSync("./QuizData"))
        fs_1.mkdirSync("QuizData");
})();
;
//#region Classes
var Base = /** @class */ (function () {
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
    function Base(data) {
        var _a, _b;
        //# handle Date
        var date = new Date().getTime();
        this.name = (_a = data === null || data === void 0 ? void 0 : data.name) !== null && _a !== void 0 ? _a : null;
        this.description = (_b = data === null || data === void 0 ? void 0 : data.description) !== null && _b !== void 0 ? _b : null;
        this.quizList = [];
        this.defaultTime = data === null || data === void 0 ? void 0 : data.defaultTime;
        this.history = [];
        this.created = data === null || data === void 0 ? void 0 : data.created;
        this.lastModified = date;
        this.tried = data === null || data === void 0 ? void 0 : data.tried;
        this.perfect = data === null || data === void 0 ? void 0 : data.perfect;
        this.failure = data === null || data === void 0 ? void 0 : data.failure;
    }
    Base.prototype.setDescription = function (description) {
        if (!description)
            throw new Error("description is required");
        this.description = description;
        return this;
    };
    ;
    Base.prototype.addQuiz = function (Question, Answer, Hint, Time) {
        if (!Question)
            throw new Error("Question is required");
        if (!Answer)
            throw new Error("Answer is required");
        var filter = this.quizList.filter(function (i) { return i.question === Question; });
        if (filter.length !== 0)
            throw new Error(Question + " is already in the quiz");
        this.quizList.push({
            question: Question,
            answer: Answer,
            hint: Hint !== null && Hint !== void 0 ? Hint : [],
            time: Time !== null && Time !== void 0 ? Time : null
        });
        return this;
    };
    ;
    Base.prototype.removeQuiz = function (Question) {
        if (!Question || !this.quizList.find(function (i) { return i.question == Question; }))
            throw new Error("quiz is required");
        var Index = this.quizList.findIndex(function (i) { return i.question == Question; });
        if (Index < -1)
            throw new Error(Question + " is not defined");
        this.quizList.splice(Index, 1);
        return this;
    };
    ;
    Base.prototype.addHistory = function (Data) {
        var _a, _b, _c, _d, _e, _f;
        if (!Data.date)
            throw new Error("data is required");
        if (!((_a = Data.settings) === null || _a === void 0 ? void 0 : _a.size))
            throw new Error("size in settings is required");
        if (!((_b = Data.settings) === null || _b === void 0 ? void 0 : _b.quizSize))
            throw new Error("quizSize in settings is required");
        if (!((_c = Data.settings) === null || _c === void 0 ? void 0 : _c.falseLimit))
            throw new Error("falseLimit in settings is required");
        if (!((_d = Data.settings) === null || _d === void 0 ? void 0 : _d.timer))
            throw new Error("timer in settings is required");
        if (!((_e = Data.score) === null || _e === void 0 ? void 0 : _e.collectAnswer))
            throw new Error("collectAnswer in score is required");
        if (!((_f = Data.score) === null || _f === void 0 ? void 0 : _f.wrongAnswer))
            throw new Error("wrongAnswer in score is required");
        if (typeof Data.false != "boolean")
            throw new Error("false is required");
        this.history.push(Data);
        return this;
    };
    ;
    Base.prototype.setDefaultTime = function (Time) {
        if (!Time)
            throw new Error("Time is required");
        this.defaultTime = Time;
        return this;
    };
    ;
    Base.prototype.addCount = function (Type) {
        if (this.created == null)
            throw new Error("You can use this function after create QuizkPack DataFile");
        this[Type]++;
        return this;
    };
    ;
    return Base;
}());
;
var QuizPack = /** @class */ (function (_super) {
    __extends(QuizPack, _super);
    function QuizPack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuizPack.prototype.setName = function (name) {
        if (!name)
            throw new Error("name is required");
        this.name = name;
        return this;
    };
    ;
    return QuizPack;
}(Base));
exports.QuizPack = QuizPack;
;
//# functions for using in module
function sendMessage(status, message) {
    return { status: status, message: message };
}
;
function fileCheck(name) {
    try {
        var path = "./QuizData/" + name + ".json";
        var handle = fs_1.existsSync(path);
        if (!handle)
            return sendMessage(409, "Quiz name " + name + " is not defined");
        var data = fs_1.readFileSync(path, "utf-8");
        return sendMessage(200, data);
    }
    catch (e) {
        return sendMessage(409, e);
    }
    ;
}
;
//# functions for User using
function createQuizPack(data) {
    try {
        var date = new Date().getTime();
        if (!data.name)
            throw new Error("QuizPack name is required");
        var file = fileCheck(data.name);
        if (file.status === 200)
            throw new Error("QuizPack name " + data.name + " is already created");
        data.created = date;
        data.lastModified = date;
        fs_1.writeFileSync("./QuizData/" + data.name + ".json", JSON.stringify(data));
        return sendMessage(200, "Success to create " + data.name);
    }
    catch (e) {
        return sendMessage(409, e);
    }
}
exports.createQuizPack = createQuizPack;
;
function editQuizPack(data, options) {
    var _a;
    try {
        if (!data.name)
            throw new Error("Quiz name is required");
        var name_1 = (_a = options === null || options === void 0 ? void 0 : options.oldName) !== null && _a !== void 0 ? _a : data.name;
        var file = fileCheck(name_1);
        if (file.status === 409)
            throw new Error("QuizPack name " + name_1 + " is not defined");
        if ((options === null || options === void 0 ? void 0 : options.type) === "save") {
            data.lastModified = new Date().getTime();
        }
        fs_1.writeFileSync("./QuizData/" + name_1 + ".json", JSON.stringify(data));
        return { status: 200, message: "Success to edit " + name_1 };
    }
    catch (e) {
        return sendMessage(409, e);
    }
}
exports.editQuizPack = editQuizPack;
;
function saveQuizPack(data) {
    try {
        if (!data.name)
            throw new Error("Quiz name is required");
        var file = fileCheck(data.name);
        if (file.status === 409)
            throw new Error("QuizPack name " + data.name + " is not defined");
        fs_1.writeFileSync("./QuizData/" + data.name + ".json", JSON.stringify(data));
        return { status: 200, message: "Success to save " + data.name };
    }
    catch (e) {
        return sendMessage(409, e);
    }
}
exports.saveQuizPack = saveQuizPack;
;
function getQuizPack(name) {
    try {
        var datas = fs_1.readdirSync("./QuizData").filter(function (i) { return i.includes(".json"); });
        if (!name)
            return datas;
        var data = fileCheck(name);
        return new Base(JSON.parse(data.message));
    }
    catch (e) {
        return sendMessage(409, e);
    }
}
exports.getQuizPack = getQuizPack;
function deleteQuizPack(name) {
    try {
        var handle = fileCheck(name);
        if (handle.status === 409)
            return handle;
        fs_1.unlinkSync("./QuizData/" + name + ".json");
        return sendMessage(200, "Success to delete " + name);
    }
    catch (e) {
        return sendMessage(409, e);
    }
}
exports.deleteQuizPack = deleteQuizPack;
function renameQuizPack(name, newName) {
    try {
        if (!name)
            throw new Error("name is required");
        if (!newName)
            throw new Error("newName is required");
        var data = fileCheck(name);
        var pack = new QuizPack(JSON.parse(data.message));
        pack.setName(newName);
        editQuizPack(pack, { oldName: name });
        fs_1.renameSync("./QuizData/" + name + ".json", "./QuizData/" + newName + ".json");
        return sendMessage(200, "Success to rename " + name + " to " + newName);
    }
    catch (e) {
        return sendMessage(409, e);
    }
}
exports.renameQuizPack = renameQuizPack;
;
