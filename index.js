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
exports.renameQuiz = exports.deleteQuiz = exports.getQuiz = exports.editQuiz = exports.createQuiz = exports.QuizPack = void 0;
var fs_1 = require("fs");
//# handle when data folder is not defined
(function () {
    if (!fs_1.existsSync("./QuizData"))
        fs_1.mkdirSync("QuizData");
})();
;
//#region Classes
var Base = /** @class */ (function () {
    function Base(data) {
        var _a, _b, _c;
        //# handle Date
        var date = new Date().getTime();
        /**
            * The name of this Quiz
            * @type {?string}
        */
        this.name = (_a = data === null || data === void 0 ? void 0 : data.name) !== null && _a !== void 0 ? _a : null;
        /**
            * The description of this Quiz
            * @type {?string}
        */
        this.description = (_b = data === null || data === void 0 ? void 0 : data.description) !== null && _b !== void 0 ? _b : null;
        /**
            * Represents a quiz list
            * @typedef {Object} EmbedField
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
        this.created = (_c = data === null || data === void 0 ? void 0 : data.created) !== null && _c !== void 0 ? _c : null;
        /**
            * The last revision date of Quiz
            * @type {number}
        */
        this.lastModified = date;
    }
    /**
        * Set a quiz description to the Quiz.
        * @param {string} description The description of the Quiz
        * @returns {Base}
    */
    Base.prototype.setDescription = function (description) {
        if (!description)
            throw new Error("description is required");
        this.description = description;
        return this;
    };
    ;
    /**
        * Adds a quiz to the Quiz.
        * @param {string} name The name of the Quiz
        * @param {string} answer The answer of the quiz
        * @param {?array} hint The hint of the quiz
        * @returns {Base}
    */
    Base.prototype.addQuiz = function (Question, Answer, Hint) {
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
            hint: Hint !== null && Hint !== void 0 ? Hint : []
        });
        return this;
    };
    ;
    /**
        * Remove a quiz from the Quiz.
        * @param {string} name The name of the Quiz
        * @returns {Base}
    */
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
    ;
    return Base;
}());
;
var QuizPack = /** @class */ (function (_super) {
    __extends(QuizPack, _super);
    function QuizPack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
            * Set a quiz name to the Quiz.
            * @param {string} name The name of the Quiz
            * @returns {Base}
        */
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
function createQuiz(data) {
    try {
        if (!data.name)
            throw new Error("QuizPack name is required");
        var file = fileCheck(data.name);
        data.created = new Date().getTime();
        if (file.status === 200)
            throw new Error("QuizPack name " + data.name + " is already created");
        fs_1.writeFileSync("./QuizData/" + data.name + ".json", JSON.stringify(data));
        return sendMessage(200, "Success to create " + data.name);
    }
    catch (e) {
        return sendMessage(409, e);
    }
}
exports.createQuiz = createQuiz;
;
function editQuiz(data, oldName) {
    try {
        if (!data.name)
            throw new Error("Quiz name is required");
        var name_1 = oldName !== null && oldName !== void 0 ? oldName : data.name;
        var file = fileCheck(name_1);
        if (file.status === 409)
            throw new Error("QuizPack name " + name_1 + " is not defined");
        fs_1.writeFileSync("./QuizData/" + name_1 + ".json", JSON.stringify(data));
        return { status: 200, message: "Success to edit " + name_1 };
    }
    catch (e) {
        return sendMessage(409, e);
    }
}
exports.editQuiz = editQuiz;
;
function getQuiz(name) {
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
exports.getQuiz = getQuiz;
function deleteQuiz(name) {
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
exports.deleteQuiz = deleteQuiz;
function renameQuiz(name, newName) {
    try {
        if (!name)
            throw new Error("name is required");
        if (!newName)
            throw new Error("newName is required");
        var data = fileCheck(name);
        var pack = new QuizPack(JSON.parse(data.message));
        pack.setName(newName);
        editQuiz(pack, name);
        fs_1.renameSync("./QuizData/" + name + ".json", "./QuizData/" + newName + ".json");
        return sendMessage(200, "Success to rename " + name + " to " + newName);
    }
    catch (e) {
        return sendMessage(409, e);
    }
}
exports.renameQuiz = renameQuiz;
;
