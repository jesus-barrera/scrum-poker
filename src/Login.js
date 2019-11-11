import React from 'react';
import {Header, Page} from './layout';
import JoinForm from './JoinForm';
import CreateForm from './CreateForm';

function Login(props) {
    return (
        <Page>
            <JoinForm onSubmit={props.handleJoin} />
            <CreateForm onSubmit={props.handleCreate} />
        </Page>
    );
}

export default Login;
