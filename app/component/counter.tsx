"use client"; // This directive is used in Next.js for client-side components
import React, { useState } from "react";

const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(1);

  const increment = () => setCount(count * 2);

  const decrement = () => setCount(count / 2);
  const reset = () => setCount(1);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Counter: {count}</h1>

      <div className="flex space-x-4">
        <button
          onClick={increment}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Increment
        </button>
        <button
          onClick={decrement}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Decrement
        </button>
        <button
          onClick={reset}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Counter;
