import { CREATE_ROOM, JOIN_ROOM, LEAVE_ROOM } from './room';

export const RoleTypes = {
  MASTER: 'MASTER',
  TEAM: 'TEAM',
};

// Reducer
export default function reducer(state = '', action) {
  switch (action.type) {
    case CREATE_ROOM:
      return RoleTypes.MASTER;

    case JOIN_ROOM:
      return RoleTypes.TEAM;

    case LEAVE_ROOM:
      return '';

    default:
      return state;
  }
}
