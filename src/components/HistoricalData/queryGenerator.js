import indicatorsList from '../../constants/indicatorsList';
import constants from '../../constants';

export default ({ title }) => {
  const currentYear = new Date().getFullYear() + 1;
  const defaultCountry = constants.defaultCountry.code;
  const indicatorName = title.toLowerCase().replace(/\-/g, '_');

  let query = '';
  for (let i = 5; i > 0; i--) {
    const year = currentYear - i;
    query += `\n\nyear${year}: history(country: ${defaultCountry}, year: ${year}) {
      country
      indicators {
        ${indicatorName} {
          ${indicatorsList[indicatorName]}
        }
      }
    }`
  }

  return query
};
