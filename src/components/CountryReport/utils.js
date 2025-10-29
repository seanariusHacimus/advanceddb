export const roundScore = ({ obtained, maximum, delimiter = "/" }) => {
  return `${obtained.toFixed(2)} ${delimiter} ${maximum.toFixed(2)}`;
};
