function calcResults(participants) {
    var results = getEmptyResults();

    participants.reduce(countVote, results);

    results.cards = orderCardsByFrequency(results.cards);

    return results;
}

function getEmptyResults() {
    return {
        users: [],
        cards: [],
        max: undefined,
        min: undefined,
        mode: { count: 0, cards: [] }
    };
}

function countVote(results, participant, i) {
    var card = participant.card;

    if (card) {
        let {cards, mode} = results;

        updateVotes(cards, card);
        updateMode(mode, card, cards[card]);
        updateMinMax(results, card);
    }

    results.users.push(Object.assign({}, participant));

    return results;
}

function updateVotes(cards, card) {
    if (! cards[card]) {
        cards[card] = 1;
    } else {
        cards[card]++;
    }
}

function updateMode(mode, card, count) {
    if (count > mode.count) {
        mode.count = count;
        mode.cards = [card];
    } else if (count === mode.count) {
        mode.cards.push(card);
    }
}

function updateMinMax(results, card) {
    var {min, max} = results;
    var value = getCardValue(card);

    if (isNaN(value)) {
        return;
    }

    if (min === undefined || value < min.value) {
        results.min = {card, value};
    }

    if (max === undefined || value > max.value) {
        results.max = {card, value};
    }
}

function getCardValue(card) {
    return Number(card === "1/2" ? 0.5 : card === "Inf" ? Infinity : card);
}

function orderCardsByFrequency(cards) {
    var ordered = [];

    for (var card in cards) {
        ordered.push({ card: card, count: cards[card] });
    }

    return ordered.sort((a, b) => b.count - a.count);
}

export default calcResults;
