import { createReducerFunction, ImmerReducer } from 'immer-reducer';
import { SupplierPageQuery } from '../../types/supplier';

export type DashObjType = {
  query: Array<string>;
  time: string;
};

export interface SuppliersState {
  suppliers: SupplierPageQuery | null;
}

const initialState: SuppliersState = {
  suppliers: null,
};

export class SuppliersReducer extends ImmerReducer<SuppliersState> {
  setSuppliers(suppliers: SupplierPageQuery) {
    this.draftState.suppliers = suppliers;
  }
}

export default createReducerFunction(SuppliersReducer, initialState);
