import { JOIN_ROOM, LEAVE_ROOM } from './room';

// Reducer
export default function reducer(state = null, action) {
  switch (action.type) {
    case JOIN_ROOM:
      return { ...action.user };

    case LEAVE_ROOM:
      return null;

    default:
      return state;
  }
}
