import { CREATE_ROOM, START_VOTING, LEAVE_ROOM } from './room';

// Actions
const ADD_USER = 'ADD_USER';
const REMOVE_USER = 'REMOVE_USER';
const SET_USER_STATUS = 'SET_USER_STATUS';
const SET_USER_CARD = 'SET_USER_CARD';

// Action creators
export function addUser(user) {
  return { type: ADD_USER, user };
}

export function removeUser(id) {
  return { type: REMOVE_USER, id };
}

export function setUserCard(id, card) {
  return { type: SET_USER_CARD, id, card };
}

export function setUserStatus(id, connected) {
  return { type: SET_USER_STATUS, id, connected };
}

// Reducer
export default function reducer(state = {}, action) {
  switch (action.type) {
    case CREATE_ROOM: case LEAVE_ROOM:
      return {};

    case ADD_USER:
      return { ...state, [action.user.id]: action.user };

    case REMOVE_USER:
      const { [action.id]: ignore, ...rest } = state;
      return rest;

    case SET_USER_STATUS:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          connected: action.connected,
        },
      };

    case SET_USER_CARD:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          card: action.card
        },
      };

    case START_VOTING:
      return Object.keys(state).reduce((val, id) => {
        val[id] = { ...state[id], card: null };

        return val;
      }, {});

    default:
      return state;
  }
};
