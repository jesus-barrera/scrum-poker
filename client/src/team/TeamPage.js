import React from 'react';
import { useSelector } from 'react-redux';
import { Header, Page } from '../common/layout';
import logoutIcon from '../media/icons/cerrar-sesion.svg';

function TeamViewHeader({ onLogout }) {
  const user = useSelector((state) => state.user);

  return (
    <Header>
      <div className="header__item">
        <span className="header__username">{user.username}</span>
        <img
          className="header__logout"
          src={logoutIcon}
          onClick={onLogout}
          alt="logout"
        />
      </div>
    </Header>
  );
}

function TeamPage({ onLogout, children }) {
  return (
    <Page
      header={
        <TeamViewHeader onLogout={onLogout} />
      }
    >
      {children}
    </Page>
  );
}

export default React.memo(TeamPage);
