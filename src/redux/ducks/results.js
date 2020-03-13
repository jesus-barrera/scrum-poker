import { END_VOTING, START_VOTING, LEAVE_ROOM } from './room';

// Reducer
export default function reducer(state = null, action) {
  switch (action.type) {
    case START_VOTING: case LEAVE_ROOM:
      return null;

    case END_VOTING:
      return action.results;

    default:
      return state;
  }
}
