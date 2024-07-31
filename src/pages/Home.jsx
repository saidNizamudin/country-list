import React from "react";
import styled from "@emotion/styled";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { getCountry } from "../clients";

const HomeContainer = styled.div`
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 0.5px solid #c8c8c8;
  border-radius: 10px;
  width: 700px;
  padding: 20px;
  padding-right: 50px;
  outline: none;

  &:focus {
    outline: 2px solid #8362f2;
  }

  &::placeholder {
    font-size: 18px;
    font-weight: 500;
    color: #c8c8c8;
  }

  &[type="text"] {
    font-size: 18px;
    font-weight: 500;
  }
`;

const InputIcon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #c8c8c8;
  width: 20px;
  height: 20px;
`;

const ResultContainer = styled.div`
  position: absolute;
  top: 120%;
  width: -webkit-fill-available;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 0px #00000022;
`;

const ResultItem = styled.div`
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  padding: 10px;
  padding-left: 20px;

  &:hover {
    background-color: #f4f4f4;
  }
`;

const ResultItemNoData = styled.div`
  font-size: 18px;
  font-weight: 400;
  padding: 10px;
  padding-left: 20px;
  color: #ff0000;
`;

const Loader = styled.div`
  font-size: 18px;
  font-weight: 400;
  padding: 10px;
  padding-left: 20px;
`;

function Home() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);

  const handleClick = (cca3) => {
    window.location.assign(`/${cca3}`);
  };

  useEffect(() => {
    const handleSearch = () => {
      setIsLoading(true);
      setNoDataFound(false);

      getCountry(search)
        .then((response) => {
          setCountries(response.data.slice(0, 5));
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setNoDataFound(true);
            setCountries([]);
          } else {
            console.error(error);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (search) {
      handleSearch();
    } else {
      setCountries([]);
      setNoDataFound(false);
    }
  }, [search]);

  return (
    <HomeContainer>
      <h1>Country</h1>
      <InputContainer>
        <Input
          type="text"
          placeholder="Type any country name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputIcon icon={faSearch} />
        <ResultContainer>
          {isLoading ? (
            <Loader>Loading...</Loader>
          ) : noDataFound ? (
            <ResultItemNoData>Data not found</ResultItemNoData>
          ) : (
            countries.map((country, index) => (
              <ResultItem key={index} onClick={() => handleClick(country.cca3)}>
                <span>{country.name.common}</span>
              </ResultItem>
            ))
          )}
        </ResultContainer>
      </InputContainer>
    </HomeContainer>
  );
}

export default Home;
