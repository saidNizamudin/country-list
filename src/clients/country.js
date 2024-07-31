import axios from "./axios";

export function getCountry(name) {
  return axios.request({
    method: "get",
    url: `v3.1/name/${name}`,
  });
}

export function getCountryByCode(code) {
  return axios.request({
    method: "get",
    url: `v3.1/alpha/${code}`,
  });
}

export function getCountryByCallingCode(code) {
  return axios.request({
    method: "get",
    url: `v2/callingcode/${code}`,
  });
}

export function getCountryByCurrency(currency) {
    return axios.request({
        method: "get",
        url: `v2/currency/${currency}`,
    });
}