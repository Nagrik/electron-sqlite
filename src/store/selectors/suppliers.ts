import { createSelector, Selector } from 'reselect';
import { SupplierPageQuery } from '../../types/supplier';
import { State } from '../index';

const selectSupplier = (state: State) => state.suppliersReducer;

export const selectSuppliers: Selector<State, SupplierPageQuery | null> =
  createSelector(selectSupplier, ({ suppliers }) => suppliers);
