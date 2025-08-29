import { gql } from '../utils';

export const FETCH_ALL_MEMBERS = gql`
  query($filter: AccountFilter, $pagination: Pagination, $order: AccountOrder) {
    accounts(filter: $filter, pagination: $pagination, order: $order) {
      nodes {
        ...account
      }
      page
      size
      pages
      total
      __typename
    }
  }

  fragment account on Account {
    id
    email
    phone
    leader_groups {
      id
      title
      leaders {
        id
      }
    }
    member_groups {
      id
      title
      leaders {
        id
      }
    }
    first_name
    request_password_change
    middle_name
    last_name
    role
    comment
    created_at
    status
    type
    prefix
    job_position
    photo {
      url
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

export const APPROVE_ACCOUNT_MUTATION = gql`
  mutation activate_account_by_id($id: Uuid!) {
    activate_account(id: $id) {
      id
      email
      phone
      first_name
      request_password_change
      middle_name
      last_name
      role
      status
    }
  }
`;

export const DENY_ACCOUNT_MUTATION = gql`
  mutation deny_account($id: Uuid!) {
    deny_account(id: $id) {
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
    status
  }
`;

export const UPDATE_MEMBER_ACCOUNT = gql`
  mutation update_account($account: UpdateAccountInput!, $id: Uuid!) {
    update_account(account: $account, id: $id) {
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
    comment
    status
    prefix
    job_position

    storage
    __typename
    organization {
      id
      title
    }
    last_session {
      ...last_session
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

export const FETCH_ACCOUNT_BY_ID = gql`
  query($id: Uuid!) {
    accounts(filter: {id: $id}, pagination: {size: -1}) {
      nodes {
        ...account
      }
    }
    organizations(filter: {}, pagination: {size: -1}) {
      nodes {
        title
      }
    }
    groups:indicator_group_infos(pagination: {size: -1}) {
      nodes {
        id
        title
      }
    }
  }

  fragment account on Account {
    id
    email
    phone
    leader_groups {
      id
      title
    }
    member_groups {
      id
      title
    }
    created_at
    first_name
    request_password_change
    middle_name
    last_name
    role
    comment
    status
    prefix
    job_position

    storage
    __typename
    photo {
      url
    }
    organization {
      id
      title
    }
    last_session {
      ...last_session
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

export const REGISTER_DUMMY_ACCOUNT = gql`
  mutation register_dummy_account($account: RegisterDummyAccountInput!) {
    register_dummy_account(account: $account) {
      id
      first_name
      last_name
    }
  }
`;