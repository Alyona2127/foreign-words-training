// Study mode:
const studyMode = document.querySelector('#study-mode');
const studyCards = document.querySelector('.study-cards');
const flipCard = document.querySelector('.flip-card');
const cardFront = document.querySelector('#card-front');
const cardBack = document.querySelector('#card-back');
const back = document.querySelector('#back');
const exam = document.querySelector('#exam');
const next = document.querySelector('#next');

// Exam mode:
const examMode = document.querySelector('#exam-mode');
const examCards = document.querySelector('#exam-cards');
const timer = document.querySelector('#time');
const currentWord = document.querySelector('#current-word');
const totalWord = document.querySelector('#total-word');

const words = [
    ['home', 'дом', 'home is the best place on earth'],
    ['lamp', 'лампа', 'the lamp was invented in 1879 by American scientist Thomas Edison'],
    ['cat', 'кот', 'сats are the most popular pets on Earth'],
    ['world', 'мир', 'the Internet is my window on the world'],
    ['apple', 'яблоко', 'an apple a day keeps the doctor away']
]

let counter = 0;

function displayCurrentWord() {
    cardFront.innerHTML = `
    <h1>${words[counter][0]}</h1>
    `;

    cardBack.innerHTML = `
    <h1>${words[counter][1]}</h1>
    <p><b>Пример:</b> <span>${words[counter][2]}</span></p>
    `;

    currentWord.textContent = `${counter + 1}`;
    totalWord.textContent = `${words.length}`;
}

displayCurrentWord();

flipCard.addEventListener('click', function() {
    if (!flipCard.classList.contains('active')) {
        flipCard.classList.add('active');
    } else {
        flipCard.classList.remove('active');
    }
});

next.addEventListener('click', function() {
    counter++;
    displayCurrentWord();
    back.disabled = false 

    if (counter === words.length - 1) {
        next.disabled = true
    }
});

back.addEventListener('click', function() {
    counter--;
    displayCurrentWord();
    next.disabled = false

    if (counter === 0) { 
        back.disabled = true;
    }
});

exam.addEventListener('click', function() {
    studyMode.classList.add('hidden');
    studyCards.classList.add('hidden');
    examMode.classList.remove('hidden');

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function displayRandomWords() {
        examCards.innerHTML = '';
        const wordCards = [];
        const translateCards = [];
        for (let i = 0; i < words.length; i++) {
            const wordCard = document.createElement('div');
            wordCard.classList.add('card');
            wordCard.textContent = words[i][0];
            wordCards.push(wordCard);

            const translateCard = document.createElement('div');
            translateCard.classList.add('card');
            translateCard.textContent = words[i][1];
            translateCards.push(translateCard);
        }
        shuffle(wordCards);
        shuffle(translateCards);
        for (let i = 0; i < words.length; i++) {
            examCards.append(wordCards[i]);
            examCards.append(translateCards[i]);
        }
    }

    displayRandomWords();

    const timerId = setInterval(() => {

        const timerData = timer.textContent.split(':');
        const minutesString = timerData[0];
        const secondsString = timerData[1];

        let minutes = parseInt(minutesString);
        let seconds = parseInt(secondsString);

        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }

        timer.textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }, 1000);

    const cards = document.querySelectorAll('.card');

    function findWord(choiceCard) {
        for (let i = 0; i < words.length; i++) {
            const word = words[i][0];
            const translate = words[i][1];
            if (choiceCard.textContent === word || choiceCard.textContent === translate) {
                return words[i];
            }
        }
    }

    let currentIndex = 0;
    let previousChoiceCard;
    let previousChoiceWord;

    cards.forEach(function(card) {
        card.addEventListener("click", function(event) {

            if (event.target.classList.contains('fade-out')) {
                return;
            }

            const choiceCard = event.target;
            if (!previousChoiceCard) {
                previousChoiceCard = choiceCard;
                previousChoiceWord = findWord(choiceCard);
                choiceCard.classList.add('correct');
                return;
            }

            if (choiceCard.textContent !== previousChoiceCard.textContent) {
                const choiceWord = findWord(choiceCard)
                if (previousChoiceWord === choiceWord) {
                    choiceCard.classList.add('correct');
                    choiceCard.classList.add('fade-out');
                    previousChoiceCard.classList.add('fade-out');
                    previousChoiceCard = null;
                    currentIndex++;

                    setTimeout(function() {
                        if (currentIndex === words.length) {
                            alert(`Вы победили! Ваше время - ${timer.textContent}`);
                            clearInterval(timerId);
                            currentIndex = 0;
                        }
                    }, 500)
                } else {
                    choiceCard.classList.add('wrong');
                    setTimeout(function() {
                        choiceCard.classList.remove('wrong');
                        previousChoiceCard.classList.remove('correct');
                        previousChoiceCard = null;
                    }, 500)
                }
            }

        });
    });

});