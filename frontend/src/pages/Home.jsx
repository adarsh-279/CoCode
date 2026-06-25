import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-2">MERN Pro App</h1>
      <p className="text-lg mb-6 text-gray-600">
        Project created successfully using create-mern-pro
      </p>

      <div className="bg-gray-100 p-4 rounded-lg w-full max-w-md mb-4">
        <h2 className="font-semibold mb-2">Project Structure</h2>
        <ul className="list-disc ml-5">
          <li>Backend (Node + Express)</li>
          <li>Frontend (React + Vite)</li>
        </ul>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg w-full max-w-md">
        <h2 className="font-semibold mb-2">Start</h2>
        <p>Run: npm run dev</p>
      </div>
    </div>
  );
};

export default Home