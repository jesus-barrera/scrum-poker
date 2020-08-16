import React from 'react';
import { useSelector } from 'react-redux';
import { Page, Header } from '../common/layout';
import logoutIcon from '../media/icons/cerrar-sesion.svg';

function MasterViewHeader({ onLogout }) {
  const { id, name } = useSelector((state) => state.room);

  return (
    <Header>
      <div className="header__item session">
        {name && <span className="session__name">{name}, &nbsp;</span>}
        <span className="session__id"><b>ID de sesión:</b> {id}</span>
      </div>
      <img
        className="header__logout"
        src={logoutIcon}
        onClick={onLogout}
        alt="logout"
      />
    </Header>
  );
}

function MasterPage({ onLogout, children }) {
  return (
    <Page
      header={
        <MasterViewHeader onLogout={onLogout} />
      }
    >
      {children}
    </Page>
  );
}

export default React.memo(MasterPage);
