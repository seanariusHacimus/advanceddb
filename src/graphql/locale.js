import {gql} from '../utils';

export const FETCH_LOCALE_VERSIONS = gql`
  query locales($code: [String!]) {
    locales(code: $code) {
      code
      version
    }
  }
`;

export const FETCH_LOCALES = gql`
  query locales($code: [String!]) {
    locales(code: $code) {
      code
      version
      dictionary
    }
  }
`;
