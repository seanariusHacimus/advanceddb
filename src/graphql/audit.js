import { gql } from '../utils';

export const FETCH_AUDIT_LOGS = gql`
  query actions_logs($filter: ActionLogFilter, $pagination: Pagination, $order: ActionLogOrder) {
  		action_logs(filter: $filter, pagination: $pagination, order: $order) {
      nodes {
          id
          committed_data
          created_at
          location
          previous_data
          event
          event_description
          initiator {
            id
            first_name
            last_name
            photo {
              url
            }
          }
      }
      page
      size
      pages
      total
      __typename
    }
  }

`;



