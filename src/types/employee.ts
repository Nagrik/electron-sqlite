import { Query } from './query';

export type Employee = {
  address: string;
  birthDate: string;
  city: string;
  country: string;
  id: number;
  extension: number;
  firstName: string;
  hireDate: string;
  homePhone: string;
  lastName: string;
  notes: string;
  postalCode: string;
  region: string;
  reportsTo: number;
  reportsToName: string;
  title: string;
  titleOfCourtesy: string;
};

export type EmployeeQuery = {
  queries: Query[];
  data: Employee[];
  reports: Employee[];
};

export type EmployeePageQuery = {
  queries?: Query[];
  count: number;
  data: Employee[];
};
