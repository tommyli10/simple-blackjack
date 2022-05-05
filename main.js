// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1

const newDeck = document.querySelector('#create');
newDeck.addEventListener('click', makeNewDeck)

let deckID = '';

function makeNewDeck() {
    const value = document.querySelector('input').value;
    const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${value}`;
    getFetch(url);
}

function getFetch(url) {
    fetch(url)
        .then(res => res.json())//parse response as JSON
        .then(data => {
            deckID = data.deck_id;
            document.querySelector('#deckID').textContent += deckID;
            document.querySelector('#cardCount').textContent += data.remaining;
        })
        .catch(err => {
            console.log(`error ${err}`);
        })
}

const drawCard = () => {
    const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`;
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(`error ${err}`);
        })
}

const hit = document.querySelector('#hit');
hit.addEventListener('click', drawCard);