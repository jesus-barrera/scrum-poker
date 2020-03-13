import React from 'react';
import { useSelector } from 'react-redux';
import { Page, Header } from '../common/layout';

function MasterViewHeader() {
  const { id, name } = useSelector((state) => state.room);

  return (
    <Header>
      <div className="session">
        <span className="session__name">
          {name} |
        </span>
        <span className="session__id">
          <b> ID</b>: {id}
        </span>
      </div>
    </Header>
  );
}

function MasterPage({ children }) {
  return (
    <Page
      header={<MasterViewHeader/>}
    >
      {children}
    </Page>
  );
}

export default React.memo(MasterPage);
