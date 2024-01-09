// TempleSearch.js

import React, { useState } from 'react';

const TempleSearch = ({ onSearch }) => {
  const [templeName, setTempleName] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/search?title=${encodeURIComponent(templeName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      onSearch(data);
    } catch (error) {
      console.error('Error during temple search:', error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter temple name"
        value={templeName}
        onChange={(e) => setTempleName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default TempleSearch;

// // TempleSearch.js
// import { useState } from 'react';

// const TempleSearch = ({ onSearch }) => {
//   const [templeName, setTempleName] = useState('');

//   const handleSearch = async () => {
//     try {
//       // Make a request to the Flask server to search for the temple by name
//       const response = await fetch(`http://127.0.0.1:5000/temples/search?query=${encodeURIComponent(templeName)}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       // Call the onSearch function with the search result
//       onSearch(data);
//     } catch (error) {
//       console.error('Error during temple search:', error.message);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Enter temple name"
//         value={templeName}
//         onChange={(e) => setTempleName(e.target.value)}
//       />
//       <button onClick={handleSearch}>Search</button>
//     </div>
//   );
// };

// export default TempleSearch;
