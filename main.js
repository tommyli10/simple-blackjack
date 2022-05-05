// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1

let deckID = '';

const makeNewDeck = async () => {
    try {
        const value = document.querySelector('input').value;
        const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${value}`;
        const res = await axios.get(url);
        deckID = res.data.deck_id;
        document.querySelector('#deckID').textContent += deckID;
        document.querySelector('#cardCount').textContent += res.data.remaining;
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

const drawCard = async () => {
    try {
        const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`;
        const res = await axios.get(url);
        const currentCard = res.data.cards[0];
        console.log(currentCard);
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

const newDeck = document.querySelector('#create');
newDeck.addEventListener('click', makeNewDeck)

const hit = document.querySelector('#hit');
hit.addEventListener('click', drawCard);

