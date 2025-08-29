import { gql } from "../utils";

export const NOTIFICATIONS_QUERY = gql`
  query($filter: NotificationFilter, $pagination: Pagination) {
    notifications(filter: $filter, pagination: $pagination) {
      nodes {
        id
        trigger_account {
          ...account_name
        }
        link {
          relative_url
        }
        target_action {
          name
          group {
            title
          }
          responsive_accounts {
            ...account_name
          }
        }
        text
        type
        status
        created_at
      }
    }
  }

  fragment account_name on Account {
    first_name
    middle_name
    last_name
  }
`;

export const READ_NOTIFICATIONS_QUERY = gql`
  mutation($filter: ReadOrDeleteNotificationFilter!) {
    read_notifications(filter: $filter) {
      id
      trigger_account {
        ...account_name
      }
      target_action {
        name
        group {
          title
        }
        responsive_accounts {
          ...account_name
        }
      }
      text
      type
      status
      created_at
    }
  }

  fragment account_name on Account {
    first_name
    middle_name
    last_name
  }
`;

export const DELETE_NOTIFICATIONS_QUERY = gql`
  mutation($filter: ReadOrDeleteNotificationFilter!) {
    delete_notifications(filter: $filter) {
      id
      trigger_account {
        ...account_name
      }
      target_action {
        name
        group {
          title
        }
        responsive_accounts {
          ...account_name
        }
      }
      text
      type
      status
      created_at
    }
  }

  fragment account_name on Account {
    first_name
    middle_name
    last_name
  }
`;
