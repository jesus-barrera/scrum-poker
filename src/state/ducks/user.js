import { JOIN_ROOM } from './room';

// Reducer
export default function reducer(state = null, action) {
  switch (action.type) {
    case JOIN_ROOM:
      return { ...action.user };

    default:
      return state;
  }
}
