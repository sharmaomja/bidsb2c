import React, { useEffect, useState } from 'react';

const TopWinners = () => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    // Fetch top winners
    fetch('/api/auctions/top-winners')
      .then(response => response.json())
      .then(data => setWinners(data))
      .catch(error => console.error('Error fetching top winners:', error));
  }, []);

  return (
    <div>
      <h2>Top Winners</h2>
      <ul>
        {winners.map(winner => (
          <li key={winner.userId}>{winner.name} - Wins: {winner.wins}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopWinners;
