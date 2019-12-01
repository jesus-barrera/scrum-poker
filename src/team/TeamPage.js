import React from 'react';
import {Header, Page} from '../common/layout';
import AppContext from '../common/AppContext';
import logoutIcon from '../assets/cerrar-sesion.svg';

function TeamViewHeader(props) {
    return (
        <AppContext.Consumer>
            {context => (
                <Header>
                    <div className="header__item">
                        <span className="header__username">{context.user.username}</span>
                        <img
                            className="header__logout"
                            src={logoutIcon}
                            onClick={props.onLogout}
                            alt="logout"
                        />
                    </div>
                </Header>
            )}
        </AppContext.Consumer>
    );
}

function TeamPage(props) {
    return (
        <Page
            header={
                <TeamViewHeader onLogout={props.onLogout} />
            }
        >
            {props.children}
        </Page>
    );
}

export default React.memo(TeamPage);
