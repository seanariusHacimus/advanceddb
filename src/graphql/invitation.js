import { gql } from '../utils';

export const INVITE_ACCOUNT = gql`
  mutation invite_account($account: InviteAccountInput!) {
    invite_account(account:$account) {
      ...account
    }
  }


  fragment account on Account {
    id
    photo {
      id
      url
    }
    leader_groups {
      id
      title
    }
    member_groups {
      id
      title
    }
    email
    phone
    first_name
    created_at
    updated_at
    request_password_change
    middle_name
    last_name
    role
    comment
    status
    storage
    photo {
      url
    }
    __typename
    job_position
    prefix
    organization {
      id
      title
    }
  }`;
export const REGISTER_WITH_INVITATION_MUTATION = gql`
  mutation($account: RegisterAccountInput!, $send_email: Boolean) {
    register_account(account: $account, send_email: $send_email) {
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
export const ACTIVATE_ACCOUNT_BY_INVITE = gql`
  mutation activate_account_by_invitation($invitation_token: String!) {
    activate_account_by_invitation(invitation_token: $invitation_token) {
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

export const DELETE_ACCOUNT = gql`
  mutation delete_account($id: Uuid!) {
    delete_account(id: $id){
      ...account
    }
  }

  fragment account on Account {
    id
  }

`;


export const RESEND_INVITATION = gql`
  mutation resend_account_invite($id: Uuid!) {
    resend_account_invite(id: $id){
      ...account
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

export const CANCEL_INVITE = gql`
  mutation cancel_account_invite($id: Uuid!) {
    cancel_account_invite(id: $id)
  }
`;
