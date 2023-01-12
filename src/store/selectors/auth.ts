import { createSelector, Selector } from 'reselect';
import { State } from '../index';
import { DashObjType } from '../reducers/auth';

const selectLogin = (state: State) => state.loginReducer;

export const selectQuery: Selector<State, Array<DashObjType> | null> =
  createSelector(
    selectLogin,
    ({ queryResponseDashboard }) => queryResponseDashboard
  );
