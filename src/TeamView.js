import React from 'react';
import {Header, Page} from './layout';
import Grid from './Grid';

class TeamView extends React.Component {
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
                <Grid />
            </Page>
        );
    }
}

export default TeamView;
