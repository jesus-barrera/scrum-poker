import React from 'react';
import {Header, Page} from './layout';
import Grid from './Grid';

class TeamView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choice: null
        };
        this.handleCardChange = this.handleCardChange.bind(this);
    }

    componentDidMount() {
        this.addListeners();
    }

    addListeners() {
        var {user, session, socket} = this.props;

        socket.on('start voting', () => {
            this.setState({ choice: null });
        });

        socket.on('room closed', () => {
            alert('La sesión ha sido terminada.');
        });

        socket.on('reconnect', () => {
            socket.emit('join room', session.id, user.username, (res) => {
                if (res.error) {
                    return;
                }

                socket.emit('card changed', this.state.choice);
            });
        });
    }

    handleCardChange(card) {
        this.props.socket.emit('card changed', card);

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
