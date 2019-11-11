import React from 'react';
import {Header, Page} from './layout';
import JoinForm from './JoinForm';
import CreateForm from './CreateForm';

function Login() {
    return (
        <Page>
            <JoinForm />
            <CreateForm />
        </Page>
    );
}

export default Login;
