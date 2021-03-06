import { combineReducers, createStore } from 'redux';
import * as reducers from './ducks';

const rootReducer = combineReducers(reducers);

// Get persisted state
const state = localStorage.getItem('state')
  ? JSON.parse(localStorage.getItem('state'))
  : undefined;

const store = createStore(rootReducer, state);

// Persist state on every change
store.subscribe(() => {
  const state = store.getState();

  localStorage.setItem('state', JSON.stringify(state));
});

export default store;
