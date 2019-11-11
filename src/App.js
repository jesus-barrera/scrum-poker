import React from 'react';
import Login from './Login.js';
import TeamView from './TeamView.js';
import MasterView from './MasterView.js';

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
    }

    handleJoin(data) {
        setTimeout(() => {
            this.setState({
                view: 'join',
                session: {name: 'Sin nombre', id: data.session},
                user: {username: data.username}
            });
        }, 1000);
    }

    handleCreate(data) {
        setTimeout(() => {
            this.setState({
                view: 'master',
                session: {name: data.session, id: '2213123123'},
            });
        }, 1000);
    }

    render() {
        const {view, session, user} = this.state;

        if (! session) {
            return <Login
                handleJoin={this.handleJoin}
                handleCreate={this.handleCreate} />
        }

        return (
            view === 'master'
                ? <MasterView session={session} />
                : <TeamView session={session} user={user} />
        );
    }
}

export default App;
