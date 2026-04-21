// Generate 5 unique random numbers (1–45)
const generateRandomNumbers = () => {
  const numbers = new Set();

  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  return Array.from(numbers);
};

// Count matches
const countMatches = (userScores, drawNumbers) => {
  return userScores.filter(score => drawNumbers.includes(score)).length;
};

module.exports = {
  generateRandomNumbers,
  countMatches,
};