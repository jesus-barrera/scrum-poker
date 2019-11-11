import React from 'react';
import {Page, Header} from './layout';
import UsersList from './UsersList';
import Results from './Results';
import './MasterView.css';

class TeamView extends React.Component {
    constructor(props) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
        this.handleResults = this.handleResults.bind(this);
        this.countVote = this.countVote.bind(this);

        this.state = {
            voting: true,
            users: [],
            results: this.getEmptyResults()
        };
    }

    componentDidMount() {
        this.setState({ users: [
            { name: "Usuario 1", card: "1" },
            { name: "Usuario 1", card: "2" },
            { name: "Usuario 1", card: "2" },
            { name: "Usuario 1", card: "13" },
            { name: "Usuario 1", card: "Bk" },
            { name: "Usuario 2", card: "100" },
            { name: "Usuario 3", card: "100" },
            { name: "Usuario 3", card: "100" }
        ]});
    }

    getEmptyResults() {
        return {
            cards: [],
            max: undefined,
            min: undefined,
            mode: { count: 0, cards: [] }
        };
    }

    handleReset() {
        this.state.users.forEach((user, index) => {
            user.card = null;
        });

        this.setState({
            users: this.state.users,
            results: this.getEmptyResults(),
            voting: true
        });
    }

    handleResults() {
        var results = this.getEmptyResults();

        this.state.users.reduce(this.countVote, results);

        results.cards = this.orderCardsByFrequency(results.cards);

        this.setState({
            results: results,
            voting: false
        });
    }

    countVote(results, user, i) {
        var card = user.card;

        if (card) {
            let {cards, mode} = results;

            this.updateVotes(cards, card);
            this.updateMode(mode, card, cards[card]);
            this.updateMinMax(results, card, i);
        }

        return results;
    }

    updateVotes(cards, card) {
        if (! cards[card]) {
            cards[card] = 1;
        } else {
            cards[card]++;
        }
    }

    updateMode(mode, card, count) {
        if (count > mode.count) {
            mode.count = count;
            mode.cards = [card];
        } else if (count === mode.count) {
            mode.cards.push(card);
        }
    }

    updateMinMax(results, card, i) {
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

    orderCardsByFrequency(cards) {
        var ordered = [];

        for (var card in cards) {
            ordered.push({ card: card, count: cards[card] });
        }

        return ordered.sort((a, b) => b.count - a.count);
    }

    render() {
        const {session} = this.props;

        if (this.state.users.length === 0) {
            return (
                <div className="no-users">
                    <h3>¿Ontán todos?</h3>
                    <p>Esperando a que los miembros del equipo se unan.</p>
                    <p>Usa el ID de la sesión <b>{session.id}</b> para unirte a la sala.</p>
                </div>
            );
        }

        var results = ! this.state.voting
            ? <Results {...this.state.results} />
            : null;

        var button = (this.state.voting)
            ? <button onClick={this.handleResults}>Terminar Votación</button>
            : <button onClick={this.handleReset}>Nueva Votación</button>;

        return (
            <Page
                header={
                    <Header>
                        <div className="session">
                            <span className="session__name">
                                {session.name} |
                            </span>
                            <span className="session__id">
                                <b> ID</b>: {session.id}
                            </span>
                        </div>
                    </Header>
                }
            >
                {results}
                <UsersList
                    users={this.state.users}
                    showResponse={! this.state.voting}
                />
                <div className="actions">
                    {button}
                </div>
            </Page>
        );
    }
}

export default TeamView;
