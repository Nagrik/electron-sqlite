export type Query = {
  select: number;
  selectWhere: number;
  selectJoin: number;
  query: string;
  executionTime?: number;
};

export type QueryParam = string[] | number[] | string[][] | number[][];

export interface QueryResult<T> {
  query: Query;
  data: T[];
}

export interface ProcessedQueryResult<T, S> {
  queries: Query[];
  data: (T | S)[];
}
