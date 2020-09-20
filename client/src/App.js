import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import Login from './login/Login';
import { ToastContainer } from './toast';
import { RoleTypes } from './redux/ducks/role';
import { TeamPlanningView } from './team';
import { MasterPlanningView } from './master';

const socket = io('', { autoConnect: false });

class App extends React.Component {
  componentDidMount() {
    // When the user is logged in (has joined a room), socket is left unopened
    // so the view knows it has to perform a reconnection. If not, the socket
    // is open from here so it can be used for login purposes.
    if (this.props.role === '') {
      socket.open();
    }
  }

  render() {
    const { role } = this.props;
    let View;

    if (role === '') {
      View = Login;
    } else if (role === RoleTypes.MASTER) {
      View = MasterPlanningView;
    } else if (role === RoleTypes.TEAM) {
      View = TeamPlanningView;
    }

    return (
      <>
        <ToastContainer />
        <View socket={socket} />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    role: state.role
  };
}

export default connect(mapStateToProps)(App);
