/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./Home";
import { getCountry } from "../clients";
import "@testing-library/jest-dom";

jest.mock("../clients", () => ({
  getCountry: jest.fn(),
}));

const mockLocationAssign = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    assign: mockLocationAssign,
  },
  writable: true,
});

describe("Home Component", () => {
  test("Render Home Component", () => {
    render(<Home />);
    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type any country name")
    ).toBeInTheDocument();
  });

  test("Display Loading", async () => {
    getCountry.mockResolvedValueOnce({ data: [] });
    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText("Type any country name"), {
      target: { value: "Ind" },
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );
  });

  test("Display No Data", async () => {
    getCountry.mockRejectedValueOnce({ response: { status: 404 } });
    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText("Type any country name"), {
      target: { value: "Not Found" },
    });
    await waitFor(() =>
      expect(screen.getByText("Data not found")).toBeInTheDocument()
    );
  });

  test("Display Result", async () => {
    const mockData = [
      { cca3: "IND", name: { common: "India" } },
      { cca3: "IDN", name: { common: "Indonesia" } },
      { cca3: "WSM", name: { common: "Samoa" } },
      { cca3: "KIR", name: { common: "Kiribati" } },
      { cca3: "IOT", name: { common: "British Indian Ocean Territory" } },
    ];

    getCountry.mockResolvedValueOnce({ data: mockData });
    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText("Type any country name"), {
      target: { value: "Ind" },
    });
    await waitFor(() =>
      expect(screen.getByText("Indonesia")).toBeInTheDocument()
    );
    expect(screen.getByText("India")).toBeInTheDocument();
  });

  test("Redirect to Country", async () => {
    const mockData = [{ cca3: "IDN", name: { common: "Indonesia" } }];
    getCountry.mockResolvedValueOnce({ data: mockData });
    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText("Type any country name"), {
      target: { value: "Indonesia" },
    });
    await waitFor(() =>
      expect(screen.getByText("Indonesia")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Indonesia"));
    expect(mockLocationAssign).toHaveBeenCalledWith(`/IDN`);
  });
});
