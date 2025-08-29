import indicatorsList from '../../constants/indicatorsList';

export default (data, title) => {
  let query = '';
  for (let i = 0; i < data.length; i++) {
    const country = data[i];
    const indicatorName = title.toLowerCase().replace(/-/g, '_');
    query += `
      ${country}: history(country: ${country}, year: 2020) {
        country 
        indicators {
          ${indicatorName} {
            ${indicatorsList[indicatorName]}
          }
        }
      }
    `
  }

  return query
};