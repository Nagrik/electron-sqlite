import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
// import { remote } from 'electron';
// import shared from '../main/main';
import { useDispatch } from 'react-redux';
import Ballot from './icons/Ballot';
import { setQuery } from '../store/actions/login';
// import { server } from '../main/main';
// import { instance } from '../main/main';

// export type SupplierType = {
//   queries: string[];
//   data: {
//     SupplierID: number;
//     CompanyName: string;
//     ContactName: string;
//     ContactTitle: string;
//     Address: string;
//     City: string;
//     Region: string;
//     PostalCode: string;
//     Country: string;
//     Phone: string;
//     Fax: string;
//     HomePage: string;
//   };
// };

type SupplierType = {
  id: number;
  companyName: string;
  contactName: string;
  contactTitle: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  fax: string;
  homePage: string;
};

const Supplier = () => {
  const navigation = useNavigate();
  const { id } = useParams();
  const goBack = () => {
    navigation('/suppliers');
  };
  const [supplierData, setSupplierData] = useState<SupplierType | null>(null);
  const [queryArr, setQueryArr] = useState<string[]>([]);
  const [queryTime, setQueryTime] = useState<string[]>([]);

  const domain = window.localStorage.getItem('domain');
  const dispatch = useDispatch();
  useEffect(() => {
    const startTime = new Date().getTime();
    window.electron.suppliers.getSuppliers(id!).then((data) => {
      const endTime = new Date().getTime();
      setQueryTime([(endTime - startTime).toString()]);
      setSupplierData(data.data[0]);
      setQueryArr([`select * from Supplier where Id = ${id}`]);
    });

    return () => {
      window.electron.removeAllListeners('getSupplier');
    };
  }, [domain, id]);
  useEffect(() => {
    if (supplierData) {
      const obj = {
        query: queryArr,
        time: new Date().toISOString(),
        executeTime: queryTime,
      };
      dispatch(setQuery(obj));
    }
  }, [dispatch, queryArr, supplierData]);

  return (
    <Wrapper>
      {supplierData ? (
        <>
          <Body>
            <Header>
              <Ballot />
              <HeaderTitle>Supplier information</HeaderTitle>
            </Header>
            <BodyContent>
              <BodyContentLeft>
                <BodyContentLeftItem>
                  <BodyContentLeftItemTitle>
                    Company Name
                  </BodyContentLeftItemTitle>
                  <BodyContentLeftItemValue>
                    {supplierData.companyName}
                  </BodyContentLeftItemValue>
                </BodyContentLeftItem>
                <BodyContentLeftItem>
                  <BodyContentLeftItemTitle>
                    Contact Name
                  </BodyContentLeftItemTitle>
                  <BodyContentLeftItemValue>
                    {supplierData.contactName}
                  </BodyContentLeftItemValue>
                </BodyContentLeftItem>
                <BodyContentLeftItem>
                  <BodyContentLeftItemTitle>
                    Contact Title
                  </BodyContentLeftItemTitle>
                  <BodyContentLeftItemValue>
                    {supplierData.contactTitle}
                  </BodyContentLeftItemValue>
                </BodyContentLeftItem>
                <BodyContentLeftItem>
                  <BodyContentLeftItemTitle>Address</BodyContentLeftItemTitle>
                  <BodyContentLeftItemValue>
                    {supplierData.address}
                  </BodyContentLeftItemValue>
                </BodyContentLeftItem>
                <BodyContentLeftItem>
                  <BodyContentLeftItemTitle>City</BodyContentLeftItemTitle>
                  <BodyContentLeftItemValue>
                    {supplierData.city}
                  </BodyContentLeftItemValue>
                </BodyContentLeftItem>
              </BodyContentLeft>
              <BodyContentRight>
                <BodyContentLeftItem>
                  <BodyContentLeftItemTitle>Region</BodyContentLeftItemTitle>
                  <BodyContentLeftItemValue>
                    {supplierData.region}
                  </BodyContentLeftItemValue>
                </BodyContentLeftItem>
                <BodyContentLeftItem>
                  <BodyContentLeftItemTitle>
                    Postal Code
                  </BodyContentLeftItemTitle>
                  <BodyContentLeftItemValue>
                    {supplierData.postalCode}
                  </BodyContentLeftItemValue>
                </BodyContentLeftItem>
                <BodyContentLeftItem>
                  <BodyContentLeftItemTitle>Country</BodyContentLeftItemTitle>
                  <BodyContentLeftItemValue>
                    {supplierData.country}
                  </BodyContentLeftItemValue>
                </BodyContentLeftItem>
                <BodyContentLeftItem>
                  <BodyContentLeftItemTitle>Phone</BodyContentLeftItemTitle>
                  <BodyContentLeftItemValue>
                    {supplierData.phone}
                  </BodyContentLeftItemValue>
                </BodyContentLeftItem>
              </BodyContentRight>
            </BodyContent>
          </Body>
          <Footer>
            <FooterButton onClick={goBack}>Go back</FooterButton>
          </Footer>
        </>
      ) : (
        <div style={{ color: '#000' }}>Loading supplier...</div>
      )}
    </Wrapper>
  );
};

export default Supplier;

const Footer = styled.div`
  padding: 24px;
  background-color: #fff;
  border: 1px solid rgba(229, 231, 235, 1);
  border-top: none;
`;

const FooterButton = styled.div`
  color: white;
  background-color: #ef4444;
  border-radius: 0.25rem;
  width: 63px;
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const BodyContentLeftItem = styled.div`
  margin-bottom: 15px;
`;
const BodyContentLeftItemTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: black;
  margin-bottom: 10px;
`;
const BodyContentLeftItemValue = styled.div`
  color: black;
`;

const BodyContent = styled.div`
  padding: 24px;
  background-color: #fff;
  display: flex;
`;

const BodyContentLeft = styled.div`
  width: 50%;
`;
const BodyContentRight = styled.div`
  width: 50%;
`;

const Body = styled.div`
  border: 1px solid rgba(229, 231, 235, 1);
`;

const Wrapper = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  color: black;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(229, 231, 235, 1);
`;

const HeaderTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-left: 8px;
`;
