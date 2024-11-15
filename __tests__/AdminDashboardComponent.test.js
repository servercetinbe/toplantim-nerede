import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboard from "../src/app/admin/page";

// Fetch'i mocklama
const mockFetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ userCount: 100, adminCount: 10, adminList: [{ id: "1", username: "adminUser1" }] }),
  })
);

beforeAll(() => {
  global.fetch = mockFetch;
});

afterEach(() => {
  mockFetch.mockClear();
});

afterAll(() => {
  global.fetch = undefined;
});

test("Renders Total Users And Total Admins", async () => {
  render(<AdminDashboard />);

  // Verinin yüklenmesini bekleyin
  await waitFor(() => {
    const totalUsersElement = screen.getAllByText(/100/)[0];
    expect(totalUsersElement).toBeInTheDocument(); // Total Users

    const totalAdminsElement = screen.getAllByText(/10/)[1];
    expect(totalAdminsElement).toBeInTheDocument(); // Total Admins
  });
});

test("Renders Admin List", async () => {
  render(<AdminDashboard />);

  await waitFor(() => {
    expect(screen.getByText(/Admin List:/i)).toBeInTheDocument();
    expect(screen.getByText("adminUser1")).toBeInTheDocument();
  });
});