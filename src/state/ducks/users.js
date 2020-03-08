import { CREATE_ROOM } from './room';

// Actions
const ADD_USER = 'ADD_USER';
const REMOVE_USER = 'ADD_USER';
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
export default function reducer(state = [], action) {
  switch (action.type) {
    case CREATE_ROOM:
      return [...action.users];

    case ADD_USER:
      return [...state, action.user];

    case REMOVE_USER:
      return state.filter((user) => user.id !== action.id);

    case SET_USER_STATUS:
      return state.map((user) => {
        if (user.id === action.id) {
          return { ...user, connected: action.connected };
        }

        return user;
      });

    case SET_USER_CARD:
      return state.map((user) => {
        if (user.id === action.id) {
          return { ...user, card: action.card };
        }

        return user;
      });

    default:
      return state;
  }
};
