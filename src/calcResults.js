function calcResults(participants) {
    var results = getEmptyResults();

    participants.reduce(countVote, results);

    results.cards = orderCardsByFrequency(results.cards);

    return results;
}

function getEmptyResults() {
    return {
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
        updateMinMax(results, card, i);
    }

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

function updateMinMax(results, card, i) {
    var {min, max} = results;

    if (isNaN( card = Number(card) )) {
        return;
    }

    if (i === 0 || card < min) {
        results.min = card;
    }

    if (i === 0 || card > max) {
        results.max = card;
    }
}

function orderCardsByFrequency(cards) {
    var ordered = [];

    for (var card in cards) {
        ordered.push({ card: card, count: cards[card] });
    }

    return ordered.sort((a, b) => b.count - a.count);
}

export getEmptyResults;
export default calcResults;
