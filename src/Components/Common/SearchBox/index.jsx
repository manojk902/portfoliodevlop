import React, { useState } from 'react';
import styles from './SearchBox.module.css';

// Dummy data to simulate API response
const dummyUsers = [
  { id: 1, name: 'Vishal', email: 'vishal@example.com', phone: '123-456-7890', details: 'Software Engineer with 3 years of experience.' },
  { id: 2, name: 'Manoj', email: 'manoj@example.com', phone: '987-654-3210', details: 'Frontend Developer skilled in React.' },
  { id: 3, name: 'Priya', email: 'priya@example.com', phone: '555-123-4567', details: 'UI/UX Designer with a passion for clean design.' },
  { id: 3, name: 'Priya', email: 'priya@example.com', phone: '555-123-4567', details: 'UI/UX Designer with a passion for clean design.' },
  { id: 3, name: 'Priya', email: 'priya@example.com', phone: '555-123-4567', details: 'UI/UX Designer with a passion for clean design.' },
];

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    setSelectedUser(null); // Reset selected user when typing

    // Filter users based on search term
    const filteredResults = dummyUsers.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filteredResults);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setQuery(''); // Clear search input
    setResults([]); // Clear results
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search users (e.g., Vishal, Manoj)..."
        value={query}
        onChange={handleSearch}
      />
      {query && (
        <ul className={styles.resultsList}>
          {results.length > 0 ? (
            results.map((user) => (
              <li
                key={user.id}
                className={styles.resultItem}
                onClick={() => handleSelectUser(user)}
              >
                {user.name}
              </li>
            ))
          ) : (
            <li className={styles.noResults}>No users found</li>
          )}
        </ul>
      )}
      {selectedUser && (
        <div className={styles.cvDetails}>
          <h3>{selectedUser.name}'s CV</h3>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Phone:</strong> {selectedUser.phone}</p>
          <p><strong>Details:</strong> {selectedUser.details}</p>
          <button
            className={styles.clearButton}
            onClick={() => setSelectedUser(null)}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBox;