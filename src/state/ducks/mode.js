import { CREATE_ROOM, JOIN_ROOM } from './room';

export const ModeTypes = {
  MASTER: 'MASTER',
  TEAM: 'TEAM',
};

// Reducer
export default function reducer(state = '', action) {
  switch (action.type) {
    case CREATE_ROOM:
      return ModeTypes.MASTER;

    case JOIN_ROOM:
      return ModeTypes.TEAM;

    default:
      return state;
  }
}
