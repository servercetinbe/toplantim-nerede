import React from 'react';
import { render } from "@testing-library/react";
import AdminDashboard from "../src/app/admin/page";

test("AdminDashboard matches snapshot", () => {
    const { asFragment } = render(<AdminDashboard />);
    expect(asFragment()).toMatchSnapshot();
})