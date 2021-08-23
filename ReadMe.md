# Quiz Maker
##### Easy to make quiz data
  
  
## Requirements?
###### All you need is node.js
  
  
  
## How to use?
  
  
```typescript
const quizMaker = require("./quizMaker");
let result;

// Create new QuizPack Class
let quiz = new quizMaker.QuizPack()
    .setName("Sample Quiz")
    .setDescription("Sample for quizMaker docs")
    .addQuiz("Birthday of Cistus", "0310", ["He never revealed", "110 + 200"])
    .removeQuiz("Birthday of Cistus");

console.log(quiz);
/*
    Return Class
    QuizPack {
        name: 'Sample Quiz',
        description: 'Sample for quizMaker docs',
        quizList: [
            {
                question: "What is the programming language Cistus's using ",
                answer: 'Node.js',
                hint: [Array]
            }
        ],
        created: null,
        lastModified: 1629700029521
    }
*/

// Create QuizPack DataFile
result = quizMaker.createQuizPack(quiz);
console.log(result);
/*
    Always Return Object
    
    if Success
    {
        status : 200,
        message : "Success to create Sample Quiz"
    };
    And create Sample Quiz.json to QuizData 

    if failure
    {
        status : 409,
        message : Error handle message
    }
*/

// Get QuizPack DataFile
result = quizMaker.getQuizPack("Sample Quiz");
console.log(result);

/*
    if Success

    Return Class
    QuizPack {
        name: 'Sample Quiz',
        description: 'Sample for quizMaker docs',
        quizList: [
            {
                question: "What is the programming language Cistus's using ",
                answer: 'Node.js',
                hint: [Array]
            }
        ],
        created: null,
        lastModified: 1629700029521
    }
    
    if failure
    {
        status : 409,
        message : Error handle message
    };
*/

// Edit QuizPack DataFile
result.setDescription("Oops I forgot to make an example like this");
result = quizMaker.editQuiz(result);
console.log(result);

/*
    Always Return Object
    
    if Success
    {
        status : 200,
        message : "Success to edit Sample Quiz"
    };
    
    if failure
    {
        status : 409,
        message : Error handle message
    };
*/

// Rename QuizPack DataFile
result = quizMaker.renameQuizPack("Sample Quiz","Sample QuizPack");
console.log(result);

/*
    Always Return Object
    
    if Success
    {
        status : 200,
        message : "Success to rename Sample Quiz to Sample QuizPack"
    };
    
    if failure
    {
        status : 409,
        message : Error handle message
    };
*/

// Delete QuizPack DataFile
result = quizMaker.deleteQuizPack("Sample QuizPack");
console.log(result);

/*
    Always Return Object
    
    if Success
    {
        status : 200,
        message : "Success to delete Sample QuizPack"
    };
    
    if failure
    {
        status : 409,
        message : Error handle message
    };
*/
```