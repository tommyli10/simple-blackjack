// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
const deckID = document.querySelector('#deckID span');
const cardCount = document.querySelector('#cardCount span');
const newCard = document.querySelector('#currentCard span');
const cardTemplate = document.querySelector('#template');
console.log(suits);

let id = '';

const makeNewDeck = async () => {
    try {
        const value = document.querySelector('input').value;
        const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${value}`;
        const res = await axios.get(url);
        id = res.data.deck_id;
        deckID.textContent = id;
        cardCount.textContent = res.data.remaining;
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

const drawCard = async () => {
    try {
        const url = `https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`;
        const res = await axios.get(url);
        const currentCard = res.data.cards[0];
        const numberSuit = currentCard.value + ' Of ' + currentCard.suit;
        newCard.textContent = numberSuit;
        cardCount.textContent = res.data.remaining;
        addCard(currentCard);
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

const addCard = (card) => {
    let clone = cardTemplate.cloneNode(true);
    clone.style.display = "inline-block";
    clone.querySelector('h4') = card.value;
    clone.querySelector()
    document.body.append(clone);
}

const newDeck = document.querySelector('#create');
newDeck.addEventListener('click', makeNewDeck)

const hit = document.querySelector('#hit');
hit.addEventListener('click', drawCard);