import { gql } from '../utils';

export const ROCKET_SIGN_IN = gql`
  mutation rocket_sign_in{
    rocket_sign_in {
      user_id
      token
    }
  }
`;

