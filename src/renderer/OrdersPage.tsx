import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import HeaderArrowIcon from './icons/HeaderArrowIcon';
import Pagination from './Pagination';
import { OrderPageQuery, OrderType } from '../types/order';
import { setQuery } from '../store/actions/login';

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderPageQuery | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryArr, setQueryArr] = useState<string[]>([]);
  const [queryTime, setQueryTime] = useState<string[]>([]);

  const dispatch = useDispatch<any>();

  useEffect(() => {
    const startTime = new Date().getTime();
    window.electron.orders.getOrderPage(currentPage).then((data) => {
      const endTime = new Date().getTime();
      setQueryTime([(endTime - startTime).toString()]);
      setOrders(data);
      setQueryArr([
        `select * from Order limit ${20} offset ${(currentPage - 1) * 20}`,
      ]);
      return () => {
        window.electron.removeAllListeners('getCustomerPage');
      };
    });
  }, [currentPage]);

  useEffect(() => {
    if (orders && orders.data.length > 0) {
      const obj = {
        query: queryArr,
        time: new Date().toISOString(),
        executeTime: queryTime,
      };
      dispatch(setQuery(obj));
    }
  }, [orders, dispatch]);

  return (
    <Wrapper>
      {orders ? (
        <>
          <Header>
            <HeaderTitle>Orders</HeaderTitle>
            <HeaderArrowIcon />
          </Header>
          <Table>
            <TableHeader>
              <Company> Id</Company>
              <Contact>Total Price</Contact>
              <Title>Products</Title>
              <City>Quantity</City>
              <Country>Shipped</Country>
              <Country>Ship Name</Country>
              <Country>City</Country>
              <Country>Country</Country>
            </TableHeader>
            <TableBody>
              {orders.data.map((order: OrderType) => (
                <TableRow>
                  <BodyCompany>
                    <Link to={`/order/${order.id}`}>{order.id}</Link>
                  </BodyCompany>
                  <BodyContact>${order.totalPrice.toFixed(0)}</BodyContact>
                  <BodyTitle>{order.productsCount}</BodyTitle>
                  <BodyCity>{order.quantitySum}</BodyCity>
                  <BodyCountry>

                  </BodyCountry>
                  <BodyCountry>{order.shipName}</BodyCountry>
                  <BodyCountry>{order.shipCity}</BodyCountry>
                  <BodyCountry1>{order.shipCountry}</BodyCountry1>
                </TableRow>
              ))}
              <PaginationWrapper>
                <PaginationRow>
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={orders.count}
                    pageSize={20}
                    onPageChange={(page: any) => setCurrentPage(page)}
                  />
                </PaginationRow>
                <PageCount>
                  Page: {currentPage} of {Math.ceil(orders.count / 20)}
                </PageCount>
              </PaginationWrapper>
            </TableBody>
          </Table>
        </>
      ) : (
        <div style={{ color: '#000' }}>Loading orders...</div>
      )}
    </Wrapper>
  );
};

export default OrdersPage;

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
`;

const PageCount = styled.div`
  font-size: 12.8px;
`;

export const PaginationNumberWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid rgba(243, 244, 246, 1);
`;

export const PaginationNumber = styled.div<{ active: boolean }>`
  //width: 7px;
  padding: 10px 16px;
  border-radius: 0.25rem;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  cursor: pointer;
  border: ${({ active }) =>
    active ? '1px solid rgba(209, 213, 219, 1)' : '1px solid #fff'};
  //margin-right: 8px;
  :hover {
    border: 1px solid black;
    border-radius: 0.25rem;
  }
`;

export const PaginationWrapper = styled.div`
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(243, 244, 246, 1);
`;

const BodyCountry1 = styled.div`
  width: 12.25%;
  padding: 9px 12px;
`;

const BodyCompany = styled.div`
  width: 5.5%;
  padding: 9px 12px;
  //border: 1px solid #000;
`;
const BodyContact = styled.div`
  width: 9%;
  padding: 9px 12px;
  //border: 1px solid #000;
`;
const BodyTitle = styled.div`
  width: 9%;
  padding: 9px 12px;
  //border: 1px solid #000;
`;
const BodyCity = styled.div`
  width: 8%;

  padding: 9px 12px;
  //border: 1px solid #000;
`;
const BodyCountry = styled.div`
  width: 12.25%;

  padding: 9px 12px;
  //border: 1px solid #000;
`;

const TableBody = styled.div`
  background-color: #fff;
`;

const TableRow = styled.div`
  width: 98%;
  display: flex;
  align-items: center;
  background-color: #f9fafb;

  &:hover {
    background-color: #f3f4f6;
  }

  &:hover:nth-child(even) {
    background-color: #f3f4f6;
  }

  &:nth-child(even) {
    background-color: #fff;
  }
`;

const Icon = styled.div`
  width: 5%;
  padding: 9px 12px;
`;

const Company = styled.div`
  width: 5.5%;
  font-size: 16px;
  font-weight: 700;
  padding: 9px 12px;
`;
const Contact = styled.div`
  width: 9%;
  font-size: 16px;
  padding: 9px 12px;
  font-weight: 700;
`;
const Title = styled.div`
  width: 8%;
  font-size: 16px;
  font-weight: 700;
  padding: 9px 12px;
`;
const City = styled.div`
  width: 7.5%;
  font-size: 16px;
  font-weight: 700;
  padding: 9px 12px;
`;
const Country = styled.div`
  width: 12.5%;
  font-size: 16px;
  font-weight: 700;
  padding: 9px 12px;
`;

const Table = styled.div``;

const TableHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
`;

const Wrapper = styled.div`
  color: black;
  padding: 24px;
  border: 1px solid rgba(243, 244, 246, 1);
`;

const Header = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid rgba(243, 244, 246, 1); ;
`;

const HeaderTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
`;
