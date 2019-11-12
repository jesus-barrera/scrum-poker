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
        this.props.socket.on('start voting', () => {
            this.setState({ choice: null });
        });

        this.props.socket.on('room closed', () => {
            alert('La sesión ha sido terminada.');
            window.location.reload(false);
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
