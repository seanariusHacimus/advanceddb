import { gql } from '../utils';

export const FETCH_ORGANIZATIONS_AND_GROUPS = gql`
  query indicator_groups {
    indicator_groups(pagination: {size: -1}, filter: {sidebar_visible: true}, order: { key: number, direction: asc }) {
      nodes {
        id
        title
        leaders {
          id
        }
      }
    }
    organizations(pagination: {size: -1}) {
      nodes {
        title
      }
    }
  }
`;
export const FETCH_ORGANIZATIONS_AND_GROUP_INFOS = gql`
  query indicator_group_infos {
    indicator_group_infos(filter: {sidebar_visible: true}, order: { key: number, direction: asc }, pagination: {size: -1}) {
      nodes {
        id
        title
      }
    }
    organizations(pagination: {size: -1}) {
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
export const SIGN_OUT_MUTATION = gql`
  mutation sign_out {
    sign_out {
      access_token
      created_at
      expired_at
      invalidated_at
      last_used_at
      last_used_ip
    }
  }
`;
export const REQUEST_ACCESS_MUTATION = gql`
  mutation($account: RegisterAccountInput!, $has_invite: Boolean) {
    register_account(account: $account, has_invite: $has_invite) {
      id
      email
      phone
      status
      type
      first_name
      middle_name
      last_name
      comment
      organization {
        title
        id
      }
    }
  }
`;
export const RESEND_EMAIL_CONFIRM = gql`
  mutation resend_account_confirm($id: Uuid!) {
    resend_account_confirm(id: $id){
      ...account
    }
  }

  fragment account on AccountInfo {
    id
    email
    status
    type
  }
`;
export const RESEND_NOT_EXPIRED_INVITATION = gql`
  mutation resend_account_not_expired_invite($id: Uuid!) {
    resend_account_not_expired_invite(id: $id){
      ...account
    }
  }
  
  fragment account on AccountInfo {
    id
    email
    status
    type
  }
`;
export const ACCOUNT_INFO = gql`
  query account_info($id: Uuid!) {
    account_info(id: $id) {
      ...account
    }
  }

  fragment account on AccountInfo {
    id
    email
    role
    comment
    first_name
    middle_name
    last_name
    phone
    organization {
      id
      title
    }
    member_groups {
      title
      id
    }
    leader_groups {
      title
      id
    }
    job_position
    prefix
    type
    status
  }
`;
export const CONFIRM_ACCOUNT = gql`
  mutation ($confirm_token: String!) {
    confirm_account(confirm_token: $confirm_token) {
      ...account
    }
  }

  fragment account on AccountInfo {
    id
    email
    comment
    first_name
    middle_name
    last_name
    phone
    organization {
      id
      title
    }
    job_position
    prefix
    type
    status
  }
`;
export const ACTIVATE_ACCOUNT_BY_INVITE = gql`
  mutation activate_account_by_invitation($token: String!) {
    activate_account_by_invitation(token: $token) {
      ...account
    }
  }

  fragment account on AccountInfo {
    id
    email
    comment
    first_name
    middle_name
    last_name
    phone
    organization {
      id
      title
    }
    job_position
    prefix
    type
    status
  }
`;
export const REQUEST_PASSWORD_RESET = gql`
  mutation init_password_reset($email: String!) {
    init_password_reset(email: $email) {
      ...reset
    }
  }
  fragment reset on Reset {
    id
    created_at
    expired_at
    canceled_at
    confirmed_at
  }
`;
export const RESET_PASSWORD_MUTATION = gql`
  mutation password_reset($password: String!, $confirm_password: String!, $reset_token: String!) {
    password_reset(password: $password, confirm_password: $confirm_password, reset_token: $reset_token) {
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
  }
`;
export const FETCH_RESET_PASSWORD_INFO = gql`
  query password_reset_info($id: Uuid!) {
    password_reset_info(id: $id) {
      ...reset
    }
  }
  fragment reset on Reset {
    id
    status
    created_at
    expired_at
    canceled_at
    confirmed_at
  }
`;
export const CANCEL_RESET_PASSWORD = gql`
  mutation cancel_password_reset($id: Uuid!) {
    cancel_password_reset(id: $id) {
      ...reset
    }
  }
  fragment reset on Reset {
    id
    created_at
    expired_at
    canceled_at
    confirmed_at
  }
`;
export const SEND_PUSH_TOKEN = gql`
  mutation set_push_token($push_token: String) {
    set_push_token(push_token: $push_token)
  }
`;
