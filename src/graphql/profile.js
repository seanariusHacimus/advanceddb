import { gql } from "../utils";

export const MY_ACCOUNT_EDIT_QUERY = gql`
  query {
    my_account {
      id
      email
      phone
      first_name
      request_password_change
      middle_name
      last_name
      role
      comment
      status
      leader_groups {
        id
        title
      }
      member_groups {
        id
        title
      }
      photo {
        url
      }
      storage
      job_position
      prefix
      organization {
        id
        title
      }
    }

    organizations(filter: {}) {
      nodes {
        title
        id
      }
    }
  }
`;

export const MY_ACCOUNT_NOTIFICATION_SETTINGS_QUERY = gql`
  query {
    my_account {
      __typename
      ...account
    }
  }

  fragment account on Account {
    id
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
`;

export const MY_ACCOUNT_QUERY = gql`
  {
    my_account {
      __typename
      ...account
    }
  }

  fragment last_session on LastSession {
    id
    created_at
    expired_at
    invalidated_at
    last_used_at
    last_used_ip
    address
    country {
      __typename
      code
      flag
      name {
        __typename
        default
      }
    }
  }

  fragment account on Account {
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
    id
    phone
    created_at
    updated_at
    comment
    storage
    notification_settings {
      action_created {      push email }
      action_updated {      push email }
      action_completed {      push email }
      action_canceled {      push email }
      action_review_requested {      push email }
      action_rejected {      push email }
      action_approved {      push email }
      action_deleted {      push email }
      action_almost_expired {      push email }
      action_expired {      push email }
    }
    __typename
    prefix
    organization {    id title }
    last_session {    __typename ...last_session }
  }`;

export const UPDATE_MY_ACCOUNT_MUTATION = gql`
  mutation update_my_account($account: UpdateMyAccountInput!) {
    update_my_account(account: $account) {
      ...account
    }
  }

  fragment account on Account {
    id
    email
    phone
    first_name
    request_password_change
    middle_name
    last_name
    role
    comment
    status
    prefix
    job_position

    photo {
      url
    }
    member_groups {
      id
      title
    }
    leader_groups {
      id
      title
    }

    storage
    __typename
    organization {
      id
      title
    }
    last_session {
      ...last_session
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

  fragment last_session on LastSession {
    id
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
  }
`;

export const UPDATE_MY_PASSWORD = gql`
  mutation update_account($new_password: NonEmptyString, $old_password: NonEmptyString) {
    update_my_password(new_password: $new_password, old_password: $old_password){
      ...account
    }
  }

  fragment account on Account {
    id
    email
    phone
    first_name
    middle_name
    last_name
    status
  }
`;
