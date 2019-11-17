import React from 'react';
import {Header, Page} from '../common/layout';
import JoinForm from './JoinForm';
import CreateForm from './CreateForm';

function Login(props) {
    return (
        <Page header={<Header />}>
            <CreateForm onSubmit={props.handleCreate} />
            <JoinForm onSubmit={props.handleJoin} />
        </Page>
    );
}

export default Login;
