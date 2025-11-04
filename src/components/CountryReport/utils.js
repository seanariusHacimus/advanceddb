import countries from "../../data/countries.json";

export const roundScore = ({ obtained, maximum, delimiter = "/" }) => {
  return `${obtained.toFixed(2)} ${delimiter} ${maximum.toFixed(2)}`;
};

export const getCountryNameFromCode = (countryCode) => {
  const country = countries.find((c) => c.id === countryCode);

  return country ? country.name : "";
};
