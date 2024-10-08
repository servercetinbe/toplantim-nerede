"use client";

import React, { useState } from "react";

const Home = (): React.ReactElement => {
  const [numbers, setNumbers] = useState("");
  const [result, setResult] = useState<null | number>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const num = numbers.split(",").map(Number);

    try {
      const res = await fetch("/api/find-second-large", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: num }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
        setError(null);
      } else {
        setError(data.error);
        setResult(null);
        console.log(error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      setResult(null);
      console.log(error);
    }
  };

  return (
    <div className="page">
      <main className="main">
        <h1 className="title">Find the Second Largest Number</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Enter numbers separated by commas"
            value={numbers}
            onChange={e => setNumbers(e.target.value)}
          />
          <button className="button" type="submit">
            Submit
          </button>
        </form>
        {result !== null && <p className="result">Second largest number: {result}</p>}
      </main>
    </div>
  );
};

export default Home;
