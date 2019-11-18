import React from 'react';
import Login from './login/Login';
import TeamView from './team/TeamView';
import MasterView from './master/MasterView';
import io from 'socket.io-client';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleJoin = this.handleJoin.bind(this);
        this.handleCreate = this.handleCreate.bind(this);

        this.state = {
            view: null,
            session: null,
            user: null
        };

        this.socket = io(":8080");
    }

    handleJoin(session, username) {
        this.setState({
            view: 'team',
            session: session,
            user: {username}
        });
    }

    handleCreate(session) {
        this.setState({
            view: 'master',
            session: session
        });
    }

    render() {
        var {view, session, user} = this.state;

        if (! session) {
            return (
                <Login
                    socket={this.socket}
                    onJoin={this.handleJoin}
                    onCreate={this.handleCreate} />
            );
        }

        var View = view === 'master' ? MasterView : TeamView;

        return (
            <View
                socket={this.socket}
                session={session}
                user={user}
            />
        );
    }
}

export default App;
