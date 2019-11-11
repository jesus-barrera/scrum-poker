import React from 'react';
import {Header, Page} from './layout';
import Grid from './Grid';
import io from 'socket.io-client';

class TeamView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choice: null
        };
        this.handleCardChange = this.handleCardChange.bind(this);
    }

    componentDidMount() {
        var socket = io();

        socket.on('connect', () => {
            socket.emit('user:login', this.props.user.username);
        });

        socket.on('reset', () => {
            this.setState({ choice: null });
        });

        this.socket = socket;
    }

    handleCardChange(card) {
        this.socket.emit('select-card', card);

        this.setState({ choice: card });
    }

    render() {
        const {user} = this.props;

        return (
            <Page
                header={
                    <Header>
                        <div>{user.username}</div>
                    </Header>
                }
            >
                <Grid
                    onCardChange={this.handleCardChange}
                    choice={this.state.choice}
                />
            </Page>
        );
    }
}

export default TeamView;
