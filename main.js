// Card API: https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1

// --------------------------------------------
// Card deck api fetch
// --------------------------------------------
const deckID = document.querySelector('#deckID span');
const cardTemplate = document.querySelector('#template');
// const cardCount = document.querySelector('#cardCount span');
// const newCard = document.querySelector('#currentCard span');

let id = '';

// Make new deck
const makeNewDeck = async () => {
    try {
        // change this value for choose how many deck of cards you want 
        let count = 6;
        const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${count}`;

        const res = await axios.get(url);
        id = res.data.deck_id;
        deckID.textContent = id;
        cardCount.textContent = res.data.remaining;
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

// Get new card from deck
const drawCard = async () => {
    try {
        const url = `https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`;
        const res = await axios.get(url);
        const currentCard = res.data.cards[0];
        // card info for maintainance purposes
        // const numberSuit = currentCard.value + ' Of ' + currentCard.suit;
        // newCard.textContent = numberSuit;
        // cardCount.textContent = res.data.remaining;
        return addCard(currentCard);
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

// create card based on info of the freshly drawn card and the card template
const addCard = (card) => {
    let clone = cardTemplate.cloneNode(true);
    clone.style.display = "inline-block";
    const numbers = clone.querySelectorAll('h4');
    Array.from(numbers).forEach(number => {
        if (card.value.length > 3) {
            number.innerText = card.value[0];
            return;
        } else if (card.value.length === 3) {
            number.innerText = 'A';
            return;
        } else if (card.value.length === 2) {
            number.style.right = '5px';
        }
        number.innerText = card.value;
    })

    const suits = clone.querySelectorAll('img');
    Array.from(suits).forEach(suit => {
        switch (card.suit) {
            case 'SPADES':
                suit.src = 'assets/suit-spade-fill.svg';
                break;
            case 'CLUBS':
                suit.src = 'assets/suit-club-fill.svg';
                break;
            case 'HEARTS':
                suit.src = 'assets/suit-heart-fill.svg';
                suit.classList.add('red');
                break;
            case 'DIAMONDS':
                suit.src = 'assets/suit-diamond-fill.svg';
                suit.classList.add('red');
                break;
        }
    })

    return clone;
}



// --------------------------------------------
// Game Events and Logic
// --------------------------------------------
const dealer = document.querySelector('#dealer div');
const player = document.querySelector('#player div');
const hit = document.querySelector('#hit');
const stand = document.querySelector('#stand');
const newGame = document.querySelector('#newGame');
const nextRound = document.querySelector('#nextRound button');
const playerScore = document.querySelector('#playerScore span');
const dealerScore = document.querySelector('#dealerScore span');
const backside = document.querySelector('#backside');
const dealerLose = dealer.parentElement.querySelector('.lose');
const dealerWin = dealer.parentElement.querySelector('.win');
const playerLose = player.parentElement.querySelector('.lose');
const playerWin = player.parentElement.querySelector('.win');
let playerCount = 0;
let dealerCount = 0;
let playerAces = 0;
let dealerAces = 0;

// an object with numbers as keys and actual values as card counts
// let numberValues = { 'A': 11, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10 }
let numberValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

// reset for each new round without calling a new deck
const resetBoard = () => {
    dealer.innerHTML = '';
    player.innerHTML = '';
    playerCount = 0;
    dealerCount = 0;
    playerScore.innerText = playerCount;
    dealerScore.innerText = dealerCount;
    const bothTable = document.querySelectorAll('.mask');
    Array.from(bothTable).forEach(element => {
        element.style.display = 'none';
    });
    nextRound.style.display = 'none';
    playerAces = 0;
    dealerAces = 0;
    hit.removeAttribute('disabled');
    stand.removeAttribute('disabled');
}

// when new game or round starts, draws two cards for player and one card for dealer
const start = async (firstRound) => {
    resetBoard();
    if (firstRound) await makeNewDeck();
    var clone = backside.cloneNode(true);
    clone.style.display = 'inline-block';
    dealer.append(clone);
    await drawDealer();
    await drawPlayer();
    await drawPlayer();
}

const newRound = () => {
    resetBoard();
    // when a new round starts, start()'s argument needs to be false so a new deck is not drawn
    start(false);
    console.log(id);
}

const drawPlayer = async () => {
    let card = await drawCard();
    if (card == undefined) return;
    player.append(card);
    let value = card.querySelector('h4').innerText;
    let index = numberValues.indexOf(value);
    if (index == 0) {
        playerAces++;
        playerCount++;
    } else if (index > 8) {
        playerCount += 10;
    } else {
        playerCount += index + 1;
    }

    let display = playerCount;
    if (playerCount + 10 <= 21 && playerAces > 0) {
        display += 10;
    }
    playerScore.innerText = display;
    if (display == 21) {
        youWon();
    } else if (display > 21) {
        youLost();
    }
}

const drawDealer = async () => {
    let card = await drawCard();
    if (card == undefined) return;
    dealer.append(card);
    let value = card.querySelector('h4').innerText;
    let index = numberValues.indexOf(value);

    if (index == 0) {
        dealerAces++;
        dealerCount++;
    } else if (index > 8) {
        dealerCount += 10;
    } else {
        dealerCount += index + 1;
    }

    let display = dealerCount;
    if (dealerCount + 10 <= 21 && dealerAces > 0) {
        display += 10;
    }
    dealerScore.innerText = display;
}

const fold = async () => {
    await drawDealer();
    const backsideCard = dealer.querySelector('#backside');
    backsideCard.style.display = 'none';

    // player count
    let p = parseInt(playerScore.innerText);
    // dealer count
    let d = parseInt(dealerScore.innerText);
    // console.log(`dealerCount: ${d}`);
    // console.log(`playerCount: ${p}`);
    while (d < 21 && d < p) {
        await drawDealer();
        d = parseInt(dealerScore.innerText);
    }
    if (d > 21) {
        youWon();
    } else {
        youLost();
    }
}

const youWon = () => {
    playerWin.style.display = 'flex';
    dealerLose.style.display = 'flex';
    nextRound.style.display = 'inline-block';
    hit.setAttribute('disabled', true);
    stand.setAttribute('disabled', true);
}

const youLost = () => {
    playerLose.style.display = 'flex';
    dealerWin.style.display = 'flex';
    nextRound.style.display = 'inline-block';
    hit.setAttribute('disabled', true);
    stand.setAttribute('disabled', true);
}

newGame.addEventListener('click', start)
hit.addEventListener('click', drawPlayer);
stand.addEventListener('click', fold);
nextRound.addEventListener('click', newRound);