// Actions
export const JOIN_ROOM = 'JOIN_ROOM';
export const CREATE_ROOM = 'CREATE_ROOM';
const START_VOTING = 'START_VOTING';
const END_VOTING = 'END_VOTING';

// Action creators
export function joinRoom(room, user) {
  return { type: JOIN_ROOM, room, user };
}

export function createRoom(room, users) {
  return { type: CREATE_ROOM, room, users };
}

export function startVoting() {
    return { type: START_VOTING };
}

export function endVoting() {
  return { type: END_VOTING };
}

// Reducer
export default function room(state = null, action) {
  switch (action.type) {
    case JOIN_ROOM: case CREATE_ROOM:
      return { ...action.room };

    case END_VOTING:
      return state && { ...state, voting: false };

    case START_VOTING:
      return state && { ...state, voting: true };

    default:
      return state;
  }
}
