import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SearchIcon from './icons/SearchIcon';
import useOnClickOutside from './hooks/useOnClickOutside';
import { ProductQuery } from '../types/product';
import { CustomerQuery } from '../types/customer';
import { setQuery } from '../store/actions/login';

const SearchPage = () => {
  const [inputActive, setInputActive] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [queryArr, setQueryArr] = useState<string[]>([]);
  const [queryTimeProduct, setQueryTimeProduct] = useState<string[]>([]);
  const [queryTimeCustomer, setQueryTimeCustomer] = useState<string[]>([]);
  const [searchResponseProducts, setSearchResponseProducts] = useState<
    ProductQuery[] | null
  >(null);
  const [searchResponseCustomer, setSearchResponseCustomer] = useState<
    CustomerQuery[] | null
  >(null);
  const [isProductsActive, setIsProductsActive] = useState<boolean>(false);
  const [enterPressed, setEnterPressed] = useState<boolean>(false);
  const inputRef = useOnClickOutside(() => {
    setInputActive(false);
  });

  const dispatch = useDispatch<any>();

  const handleInput = (e: any) => {
    setInputValue(e.target.value);
    setEnterPressed(true);
    if (e.key === 'Enter') {
      if (isProductsActive) {
        const start = new Date().getTime();
        window.electron.products.searchProduct(e.target.value).then((data) => {
          // @ts-ignore
          setSearchResponseProducts(data.data);
          const end = new Date().getTime();
          const time = (end - start).toString();
          setQueryTimeProduct([time]);
          setQueryArr([
            `SELECT * FROM Product WHERE Product.ProductName like ${e.target.value}`,
          ]);
        });
      }

      if (!isProductsActive) {
        const startTimeCustomer = new Date().getTime();
        window.electron.customers
          .searchCustomer(e.target.value)
          .then((data) => {
            const endTimeCustomer = new Date().getTime();
            const timeCustomer = (
              endTimeCustomer - startTimeCustomer
            ).toString();
            setQueryTimeProduct([timeCustomer]);
            // @ts-ignore
            setSearchResponseCustomer(data.data);
            setQueryArr([
              `SELECT * FROM Customer WHERE Customer.CompanyName like ${e.target.value}`,
            ]);
          });
      }
    }
  };

  useEffect(() => {
    if (isProductsActive) {
      const obj = {
        query: queryArr,
        time: new Date().toISOString(),
        executeTime: queryTimeProduct,
      };
      dispatch(setQuery(obj));
    }
    return () => {
      window.electron.removeAllListeners('searchProducts');
    };
  }, [dispatch, queryArr, searchResponseCustomer, searchResponseProducts]);

  useEffect(() => {
    if (!isProductsActive) {
      const obj = {
        query: queryArr,
        time: new Date().toISOString(),
        executeTime: queryTimeCustomer,
      };
      dispatch(setQuery(obj));
    }
    return () => {
      window.electron.removeAllListeners('searchCustomers');
    };
  }, [dispatch, queryArr, searchResponseCustomer, searchResponseProducts]);

  // useEffect(() => {
  //   if (searchResponseProducts && searchResponseProducts.queries.length > 0) {
  //     const obj = {
  //       query: searchResponseProducts,
  //       time: new Date().toISOString(),
  //     };
  //     dispatch(setQuery(obj));
  //   }
  // }, [searchResponseProducts, dispatch]);

  // useEffect(() => {
  //   if (searchResponseCustomer && searchResponseCustomer.queries.length > 0) {
  //     const obj = {
  //       query: searchResponseCustomer.queries,
  //       time: new Date().toISOString(),
  //     };
  //     dispatch(setQuery(obj));
  //   }
  // }, [searchResponseCustomer, dispatch]);
  return (
    <Wrapper>
      <Content>
        <ContentTitle>Search Database</ContentTitle>
        <InputWrapper
          ref={inputRef}
          active={inputActive}
          onClick={() => setInputActive(true)}
        >
          <Icon>
            <SearchIcon />
          </Icon>
          <Input
            placeholder="Enter keyword..."
            onChange={(e) => handleInput(e)}
            onKeyPress={(e) => handleInput(e)}
          />
        </InputWrapper>
        <ContentTitle>Tables</ContentTitle>
        <TableWrapper>
          <Choice onClick={() => setIsProductsActive(true)}>
            {!isProductsActive ? (
              <Circle />
            ) : (
              <CircleActive>
                <CircleActiveIcon />
              </CircleActive>
            )}

            <TableTitle>Products</TableTitle>
          </Choice>
          <Choice onClick={() => setIsProductsActive(false)}>
            {isProductsActive ? (
              <Circle />
            ) : (
              <CircleActive>
                <CircleActiveIcon />
              </CircleActive>
            )}
            <TableTitle>Customers</TableTitle>
          </Choice>
        </TableWrapper>
        <SearchResultTitle style={{ fontSize: '18px' }}>
          Search results
        </SearchResultTitle>
        {!isProductsActive && searchResponseCustomer
          ? searchResponseCustomer.map((product: any) => (
              <SearchResult>
                <SearchResultMainTitle>
                  <Link to={`/customer/${product.id}`}>
                    {product.contactName}
                  </Link>
                </SearchResultMainTitle>
                <SearchResultMainSubtitle>
                  #${product.id}, Contact:
                  {product.contactName}, Title: ${product.contactTitle}, Phone:
                  ${product.phone}
                </SearchResultMainSubtitle>
              </SearchResult>
            ))
          : !isProductsActive && (
              <SearchResult>
                <SearchResultMainTitle>
                  <SearchResultMainSubtitle>
                    {enterPressed && 'No results'}
                  </SearchResultMainSubtitle>
                </SearchResultMainTitle>
              </SearchResult>
            )}
        {isProductsActive && searchResponseProducts
          ? searchResponseProducts.map((product: any) => (
              <SearchResult>
                <SearchResultMainTitle>
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </SearchResultMainTitle>
                <SearchResultMainSubtitle>
                  #${product.id}, Quantity Per Unit: ${product.quantityPerUnit},
                  Price: ${product.unitPrice}, Stock: ${product.unitsInStock}
                </SearchResultMainSubtitle>
              </SearchResult>
            ))
          : isProductsActive && (
              <SearchResult>
                <SearchResultMainTitle>
                  <SearchResultMainSubtitle>
                    {enterPressed && 'No results'}
                  </SearchResultMainSubtitle>
                </SearchResultMainTitle>
              </SearchResult>
            )}
      </Content>
    </Wrapper>
  );
};

export default SearchPage;

const SearchResultMainSubtitle = styled.div`
  color: #9ca3af;
  font-size: 14px;
`;
const SearchResultMainTitle = styled.div`
  font-size: 16px;
  color: #2563eb;
  padding-bottom: 5px;
`;

const SearchResult = styled.div`
  padding-bottom: 8px;
`;

const SearchResultTitle = styled.div`
  margin-top: 24px;
  color: black;
  margin-bottom: 12px;
  font-weight: 700;
`;

const CircleActiveIcon = styled.div`
  width: 9px;
  height: 9px;
  border: 1px solid rgba(209, 213, 219, 1);
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CircleActive = styled.div`
  width: 20px;
  height: 20px;
  background-color: #3b82f6;
  border: 1px solid rgba(209, 213, 219, 1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Choice = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
  cursor: pointer;
`;

const TableTitle = styled.div`
  color: black;
  font-size: 16px;
  padding-left: 8px;
`;
const Circle = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid rgba(209, 213, 219, 1);
  border-radius: 50%;
  cursor: pointer;
`;
const TableWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputWrapper = styled.div<{ active: boolean }>`
  display: flex;
  color: black;
  border: ${({ active }) =>
    active ? '2px solid cadetblue' : '2px solid rgba(156, 163, 175, 1)'};
  width: 400px;
  padding: 5px 0;
  border-radius: 0.25rem;
  margin-bottom: 12px;
`;

const Input = styled.input`
  border: none;
  padding: 5px 5px;
  font-size: 16px;
  width: 400px;

  &::placeholder {
    color: rgba(156, 163, 175, 1);
    font-size: 16px;
  }

  &:focus {
    outline: none;
    border: none;
  }
`;

const ContentTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: black;
  margin-bottom: 12px;
`;

const Wrapper = styled.div`
  padding: 24px;
`;

const Content = styled.div`
  padding: 24px;
  background-color: #fff;
`;
