import React from 'react';
import io from 'socket.io-client';
import Login from './login/Login';
import TeamView from './team/TeamView';
import MasterView from './master/MasterView';
import AppContext from './common/AppContext';

var socket = io(":8080", { autoConnect: false });

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleJoin = this.handleJoin.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleRoomClosed = this.handleRoomClosed.bind(this);
        this.saveState = this.saveState.bind(this);
        this.clearState = this.clearState.bind(this);

        this.state = this.loadState();
    }

    getInitialState() {
        return {
            view: '', // Which view the user is in? 'master' or 'team', '' represents login.
            user: null, // Logged user, if any.
            room: null, // Room the user is logged in.
            socket: socket,
            handleRoomClosed: this.handleRoomClosed,
            clearState: this.clearState
        };
    }

    componentDidMount() {
        // When the user is logged in (has joined a room), socket is left unopened
        // so the view knows it has to perform a reconnection. If not, the socket
        // is open from here so it can be used for login purposes.
        if (this.state.view === '') {
            socket.open();
        }
    }

    handleRoomClosed() {
        alert('La sesión fue terminada.');

        this.clearState();
    }

    handleJoin(response) {
        this.setState({view: 'team', ...response}, this.saveState);
    }

    handleCreate(room) {
        this.setState({view: 'master', room});
    }

    clearState() {
        this.setState(this.getInitialState(), this.saveState);
    }

    saveState() {
        var {handleRoomClosed, socket, ...state} = this.state;

        localStorage.setItem('state', JSON.stringify(state));
    }

    loadState() {
        var stored = JSON.parse(localStorage.getItem('state'));

        return Object.assign({}, this.getInitialState(), stored);
    }

    render() {
        var {view} = this.state;

        return (
            <AppContext.Provider value={this.state}>
                {
                    (view === 'master' && (
                        <MasterView />
                    )) ||
                    (view === 'team' && (
                        <TeamView />
                    )) || (
                        <Login
                            socket={this.state.socket}
                            onJoin={this.handleJoin}
                            onCreate={this.handleCreate}
                        />
                    )
                }
            </AppContext.Provider>
        );
    }
}

export default App;
