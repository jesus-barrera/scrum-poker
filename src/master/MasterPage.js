import React from 'react';
import {Page, Header} from '../common/layout';
import AppContext from '../common/AppContext';

function MasterViewHeader(props) {
    return (
        <AppContext.Consumer>
            {context => (
                <Header>
                    <div className="session">
                        <span className="session__name">
                            {context.room.name} |
                        </span>
                        <span className="session__id">
                            <b> ID</b>: {context.room.id}
                        </span>
                    </div>
                </Header>
            )}
        </AppContext.Consumer>
    );
}

function MasterPage(props) {
    return (
        <Page
            header={<MasterViewHeader/>}
        >
            {props.children}
        </Page>
    );
}

export default React.memo(MasterPage);
