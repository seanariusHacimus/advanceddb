import { gql } from '../utils';

export const FETCH_TAGS = gql`
  query tags {
    tags(pagination: {size: -1}) {
      nodes {
        title
      }
    }
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation sign_in($email: String!, $password: String!) {
    sign_in(email: $email, password: $password) {
      id
      access_token
      created_at
      expired_at
      invalidated_at
      last_used_at
      last_used_ip
      address
      country {
        code
        flag
        name {
          default
        }
      }
      account {
        id
        email
        first_name
        middle_name
        last_name
        job_position
        request_password_change
        leader_groups {
          id
          title
        }
        member_groups {
          id
          title
        }
        role
        status
        type
        photo {
          url
        }
        notification_settings {
          action_created {
            push
            email
          }
          action_updated {
            push
            email
          }
          action_completed {
            push
            email
          }
          action_canceled {
            push
            email
          }
          action_review_requested {
            push
            email
          }
          action_rejected {
            push
            email
          }
          action_approved {
            push
            email
          }
          action_deleted {
            push
            email
          }
          action_almost_expired {
            push
            email
          }
          action_expired {
            push
            email
          }
        }
      }
    }
  }
`;
