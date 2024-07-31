import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Country from "./Country";
import {
  getCountryByCode,
  getCountryByCallingCode,
  getCountryByCurrency,
} from "../clients";
import "@testing-library/jest-dom";

jest.mock("../clients", () => ({
  getCountryByCode: jest.fn(),
  getCountryByCallingCode: jest.fn(),
  getCountryByCurrency: jest.fn(),
}));

const mockLocationAssign = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    pathname: "/IDN",
    assign: mockLocationAssign,
  },
  writable: true,
});

describe("Country Component", () => {
  test("Render Loading", () => {
    getCountryByCode.mockResolvedValueOnce({ data: [] });
    getCountryByCallingCode.mockResolvedValueOnce({ data: [] });
    getCountryByCurrency.mockResolvedValueOnce({ data: [] });

    render(<Country />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("Render Detail", async () => {
    const mockCountryData = {
      name: { common: "Indonesia" },
      flags: { png: "testIndonesia.png" },
      altSpellings: ["IDN"],
      latlng: [-5.0, 120.0],
      capital: ["Jakarta"],
      region: "Asia",
      subregion: "South-Eastern Asia",
      idd: { root: "+6", suffixes: ["2"] },
      currencies: { IDR: { name: "Indonesian rupiah" } },
    };
    const mockCallingCodeData = [{ name: "Indonesia" }];
    const mockCurrencyData = [{ name: "Indonesia" }];

    getCountryByCode.mockResolvedValueOnce({ data: [mockCountryData] });
    getCountryByCallingCode.mockResolvedValueOnce({
      data: mockCallingCodeData,
    });
    getCountryByCurrency.mockResolvedValueOnce({ data: mockCurrencyData });

    render(<Country />);

    await waitFor(() => {
      expect(screen.getByText("Indonesia")).toBeInTheDocument();
      expect(screen.getByAltText("Indonesia flag")).toBeInTheDocument();
      expect(screen.getByText("IDN")).toBeInTheDocument();
      expect(screen.getByText("LatLong")).toBeInTheDocument();
      expect(screen.getByText("-5.0, 120.0")).toBeInTheDocument();

      const capitalElement = screen.getByText(/Capital:/);
      expect(capitalElement).toBeInTheDocument();
      expect(capitalElement).toHaveTextContent("Jakarta");

      const regionElement = screen.getByText(/Region:/);
      expect(regionElement).toBeInTheDocument();
      expect(regionElement).toHaveTextContent("Asia");

      const subRegionElement = screen.getByText(/Subregion:/);
      expect(subRegionElement).toBeInTheDocument();
      expect(subRegionElement).toHaveTextContent("South-Eastern Asia");

      expect(screen.getByText("Calling Code")).toBeInTheDocument();
      expect(screen.getByText("62")).toBeInTheDocument();
      expect(screen.getByText("Currency")).toBeInTheDocument();
      expect(screen.getByText("IDR")).toBeInTheDocument();
    });
  });
});
