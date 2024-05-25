const app = {
    correctAnswers: 0
};

app.getComputerQuestions = () => {
    fetch(`https://opentdb.com/api.php?amount=12&category=18&difficulty=medium&type=multiple`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch questions. Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            app.questions = data.results;
            console.log(app.questions);
            return app.questions;
        })
        .catch((error) => {
            console.error('Error fetching computer questions:', error);
        });
}


app.beginQuiz = () => {
    app.currentQuestionIndex = 0; 
    app.correctAnswers = 0;
    if (app.questions && app.questions.length > 0) {
        console.log("Displaying question:", app.currentQuestionIndex);
        app.displayQuestion(app.currentQuestionIndex);
    } else {
        console.error('No questions available.');
    }
    app.nextButton = document.querySelector('.nextButton');
    app.finishButton = document.querySelector('.finishButton');
    app.submitButton = document.querySelector('.submit'); // Add this line

    // Add event listeners for the buttons
    app.nextButton.addEventListener('click', app.handleNextButtonClick);
    app.finishButton.addEventListener('click', app.handleFinishButtonClick);
    app.submitButton.addEventListener('click', app.handleFormSubmit);
}


app.handleNextButtonClick = async () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const userAnswer = selectedOption.value;

        let correctAnswer = app.questions[app.currentQuestionIndex].correct_answer;

        console.log('userAnswer:', userAnswer);
        console.log('correctAnswer:', correctAnswer);

        if (userAnswer === correctAnswer) {
            app.correctAnswers = app.correctAnswers++;
        }

        document.getElementById('currentScore').textContent = `${app.correctAnswers} / ${app.questions.length}`;
        app.currentQuestionIndex++;

        if (app.currentQuestionIndex < app.questions.length) {
            await app.displayQuestion(app.currentQuestionIndex);
        } else {
            app.showEndGame();
        }

    } else {
        // Handle the case where no option is selected
        alert("Please select an option before moving to the next question.");
    }
};

app.checkAnswer = (userAnswer, correctAnswer) => {
    const decodedUserAnswer = decodeHtmlEntities(userAnswer);
    const decodedCorrectAnswer = decodeHtmlEntities(correctAnswer);

    return decodedUserAnswer === decodedCorrectAnswer;
};

function decodeHtmlEntities(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

app.handleFinishButtonClick = () => {
    const finalScore = document.querySelector('.finalScore');
    finalScore.textContent = `Your final score: ${app.correctAnswers}/${app.questions.length}`;
    app.showEndGame();
}

app.handleFormSubmit = (event) => {
    event.preventDefault();
};

app.displayQuestion = (questionIndex) => {   
    const triviaQuestion = document.querySelector('.trivia-question');
    const options = document.querySelectorAll('.option');
    const currentQuestion = app.questions[questionIndex];

    console.log('Correct Answer:', currentQuestion.correct_answer);

    triviaQuestion.textContent = currentQuestion.question;
    const allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    options.forEach((option, index) => {
        option.textContent = allOptions[index];
    });
    document.querySelector('.quiz').classList.remove('invisible');
};

app.startGame = () => {
    console.log('Game started');
    const startGameForm = document.querySelector(".start-btn")
    if (app.header && startGameForm) {
    startGameForm.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Start button clicked');
        app.header.classList.add('invisible');
        if (app.questions && app.questions.length > 0) {
            app.beginQuiz();
        } else {
            console.error('No questions available.');
        }
    });
} else {
    console.error('Header or start button not found.');
}
}
app.getComputerQuestions();
app.finishQuiz = () => {
    app.finishButton.addEventListener("click", () => {
        if (app.currentQuestionIndex < app.questions.length - 1) {
            app.currentQuestionIndex++;
            app.displayQuestion(app.currentQuestionIndex)
        } else {
            const finalScore = document.querySelector('.finalScore')
            finalScore.textContent = "Your final score:" + app.correctAnswers;
            app.showEndGame();
        }
    });
};

app.showEndGame = () => {
    const finalScore = document.querySelector('.finalScore');
    if (finalScore) {
    finalScore.textContent = `Your final score: ${app.correctAnswers}/${app.questions.length}`;
    } else {
        console.error('Could not find element with class "finalScore"');
    }
    app.correctAnswers = 0;

    const quizSelection = document.querySelector('.quiz')
    const endGameSelection = document.querySelector('.end-game')
    if (quizSelection && endGameSelection) {
    quizSelection.classList.add('invisible');
    endGameSelection.classList.remove('invisible');
} else {
    console.error('Could not find elements with classes "quiz" or "end-game"');
}
}

app.init = async () => {
    app.header = document.querySelector('.header');
    await app.getComputerQuestions();  // Wait for questions to be fetched
    app.initQuizElements();
    app.startGame();  // Set up the start button click event listener
}

app.initQuizElements = () => {
    const quizSelection = document.querySelector('.quiz');
    const endGameSelection = document.querySelector('.end-game');

    app.quizSelection = quizSelection;
    app.endGameSelection = endGameSelection;
    app.quizForm = document.getElementById('quizForm');

    if (app.quizForm) {
    app.quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
    });
}
};


app.init();

