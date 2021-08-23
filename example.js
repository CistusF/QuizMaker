const quizMaker = require("./quizMaker");

let quiz = new quizMaker.QuizPack()
    .setName("Sample Quiz") // It require Title
    .setDescription("Sample for quizMaker docs") // It require Description
    .addQuiz("Birthday of Cistus", "0310", ["He never revealed", "110 + 200"]) // It require Question | Answer | Hint
    .addQuiz("What is the programming language Cistus's using ", "Node.js", ["[] == [] // false"])
    .removeQuiz("Birthday of Cistus");

console.log(quiz);
let result = quizMaker.createQuizPack(quiz);
console.log(result);