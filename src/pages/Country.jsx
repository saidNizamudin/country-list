import React from "react";
import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  getCountryByCallingCode,
  getCountryByCode,
  getCountryByCurrency,
} from "../clients";
import { Tooltip } from "react-tooltip";

import "react-tooltip/dist/react-tooltip.css";

// Styled Component
const LoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CountryContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 80px;
`;

const BackButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 10px;
  color: white;
  background: #8362f2;
  margin-bottom: 30px;
  cursor: pointer;
`;

const CountryHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const CountryNameAndFlag = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const CountryName = styled.span`
  margin: 0;
  font-size: 48px;
  font-weight: 700;
`;

const CountryFlag = styled.img`
  margin-left: 1rem;
  height: 30px;
`;

const CountryChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CountryChip = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: #8dd4cc;
  border-radius: 50px;
  padding: 0.5rem 1rem;
`;

const CountryDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CountryLocation = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  font-weight: 500;
  width: 500px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 0px #00000022;
`;

const LatLong = styled.h3`
  color: #8362f2;
  font-weight: 700;
  margin: 0;
`;

const CountryRegion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  font-weight: 400;
  width: 500px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 0px #00000022;
`;

const CountryCallingCode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  width: 500px;
  padding: 20px;
  font-weight: 500;
`;

const CountryCurrency = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  width: 500px;
  padding: 20px;
  font-weight: 500;
`;

const CallingCodeDetail = styled.span`
  font-weight: 500;
  font-size: 14px;
`;

const CurrencyDetail = styled.span`
  font-weight: 500;
  font-size: 14px;
`;

const UnderlineText = styled.span`
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;
  color: #8362f2;
  cursor: pointer;
`;

const TooltipStyled = styled(Tooltip)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background: #525252 !important;
  border-radius: 10px !important;
  padding: 10px 20px !important;
  max-width: 500px;
`;

const TooltipText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

function Country() {
  const [country, setCountry] = useState({});
  const [countryCallingCode, setCountryCallingCode] = useState([]);
  const [countryCurrency, setCountryCurrency] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCallingCode = ({ root, suffixes }) => {
    let callingCode = root.replace("+", "");
    if (suffixes.length > 1) {
      return callingCode;
    }

    return `${callingCode}${suffixes[0]}`;
  };

  const getCurrency = (currencies) => Object.keys(currencies)[0];

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const countryCode = window.location.pathname.split("/")[1];
        setLoading(true);

        const countryResponse = await getCountryByCode(countryCode);
        const countryData = countryResponse.data[0];
        setCountry(countryData);

        const callingCodeResponse = await getCountryByCallingCode(
          getCallingCode(countryData.idd)
        );
        setCountryCallingCode(callingCodeResponse.data);

        const currencyResponse = await getCountryByCurrency(
          getCurrency(countryData.currencies)
        );
        setCountryCurrency(currencyResponse.data);
      } catch (error) {
        console.error(error);
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <h1>Loading...</h1>
      </LoadingContainer>
    );
  }

  const {
    name: { common: countryName } = {},
    flags: { png: flagUrl } = {},
    altSpellings = [],
    latlng = [],
    capital = [],
    region,
    subregion,
  } = country;

  const callingCode = getCallingCode(country.idd);
  const currencyCode = getCurrency(country.currencies);

  return (
    <CountryContainer>
      <BackButton
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Back to Homepage</span>
      </BackButton>
      <CountryHeader>
        <CountryNameAndFlag>
          <CountryName>{countryName}</CountryName>
          <CountryFlag src={flagUrl} alt={`${countryName} flag`} />
        </CountryNameAndFlag>
        <CountryChips>
          {altSpellings.map((altSpelling, index) => (
            <CountryChip key={index}>{altSpelling}</CountryChip>
          ))}
        </CountryChips>
      </CountryHeader>
      <CountryDetails>
        <CountryLocation>
          <span>LatLong</span>
          <LatLong>{latlng.map((num) => num.toFixed(1)).join(", ")}</LatLong>
        </CountryLocation>
        <CountryRegion>
          <span>
            Capital: <b>{capital[0]}</b>
          </span>
          <span>
            Region: <b>{region}</b>
          </span>
          <span>
            Subregion: <b>{subregion}</b>
          </span>
        </CountryRegion>
        <CountryCallingCode>
          <span>Calling Code</span>
          <LatLong>{callingCode}</LatLong>
          <CallingCodeDetail>
            <UnderlineText className="underlineTextCallingCode">
              {countryCallingCode?.length} Country
            </UnderlineText>
            &nbsp; with this calling code
          </CallingCodeDetail>
        </CountryCallingCode>
        <CountryCurrency>
          <span>Currency</span>
          <LatLong>{currencyCode}</LatLong>
          <CurrencyDetail>
            <UnderlineText className="underlineTextCurrency">
              {countryCurrency?.length} Country
            </UnderlineText>
            &nbsp; with this currency
          </CurrencyDetail>
        </CountryCurrency>
      </CountryDetails>
      <TooltipStyled anchorSelect=".underlineTextCallingCode" place="bottom">
        {countryCallingCode.length <= 15 ? (
          countryCallingCode?.map((country) => (
            <TooltipText key={country.name}>{country.name}</TooltipText>
          ))
        ) : (
          <TooltipText>
            {countryCallingCode?.map((country) => country.name).join(", ")}
          </TooltipText>
        )}
      </TooltipStyled>
      <TooltipStyled anchorSelect=".underlineTextCurrency" place="bottom">
        {countryCurrency.length <= 15 ? (
          countryCurrency?.map((country) => (
            <TooltipText key={country.name}>{country.name}</TooltipText>
          ))
        ) : (
          <TooltipText>
            {countryCurrency?.map((country) => country.name).join(", ")}
          </TooltipText>
        )}
      </TooltipStyled>
    </CountryContainer>
  );
}

export default Country;
