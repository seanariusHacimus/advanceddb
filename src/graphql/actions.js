import { gql } from "../utils";

export const FETCH_WORKING_GROUPS_AND_ORGANIZATIONS = gql`
  query indicator_group_infos($filter: IndicatorGroupFilter) {
    indicator_group_infos(filter: $filter) {
      nodes {
        ...indicator_group
      }
      page
      size
      pages
      total
    }
  }

  fragment indicator_group on IndicatorGroupInfo {
    id
    title
    methodology
    removable
    what_to_reform
    __typename
  }
`;
export const FETCH_ACTIONS = gql`
  query actions(
    $filter: ActionFilter
    $pagination: Pagination
    $order: ActionOrder
  ) {
    actions(filter: $filter, pagination: $pagination, order: $order) {
      nodes {
        ...action
      }
      page
      size
      pages
      total
      __typename
    }
  }

  fragment action on Action {
    id
    name
    created_at
    updated_at
    start_at
    end_at
    pillar_number
    category
    sub_category
    action_boundaries {
      start_at
      end_at
    }
    completer {
      id
    }
    sub_actions {
      ...sub_action
    }
    sub_action_stats {
      not_started
      ongoing_past_deadline
      ongoing_within_deadline
      completed
      total
    }
    description
    number
    creator {
      id
    }
    group {
      id
    }
    attachments {
      id
      filename
      deleted_at
      file {
        download_url
      }
    }
    responsive_tags {
      title
    }
    responsive_accounts {
      id
      first_name
      last_name
      status
      photo {
        url
      }
    }
    status
  }

  fragment sub_action on SubAction {
    id
    name
    created_at
    updated_at
    start_at
    end_at
    description
    number
    creator {
      id
    }
    status
    parent_action {
      id
    }
    attachments {
      id
      deleted_at
      file {
        download_url
      }
      filename
    }
    responsive_tags {
      title
    }
    responsive_accounts {
      id
      first_name
      last_name
      status
      photo {
        url
      }
    }
  }
`;

export const UNCOMPLETE_ACTION = gql`
  mutation ($action_id: Uuid!) {
    uncomplete_action(action_id: $action_id)
  }
`;

export const COMPLETE_ACTION = gql`
  mutation ($action_id: Uuid!) {
    complete_action(action_id: $action_id)
  }
`;

export const CREATE_ACTION = gql`
  mutation ($action: CreateActionInput!, $attachments: [File!]) {
    create_action(action: $action, attachments: $attachments) {
      ...action
    }
  }

  fragment action on Action {
    id
    name
    created_at
    updated_at
    start_at
    end_at
    description
    number
    creator {
      id
    }
    attachments {
      id
    }
    responsive_accounts {
      id
      first_name
      last_name
    }
  }
`;

export const UPDATE_ACTION = gql`
  mutation ($action: UpdateActionInput!, $action_id: Uuid!) {
    update_action(action: $action, action_id: $action_id) {
      ...action
    }
  }

  fragment action on Action {
    id
    status
    name
    created_at
    updated_at
    start_at
    end_at
    completed_at
    completer {
      id
    }
    description
    number
    creator {
      id
    }
    attachments {
      id
    }
    responsive_tags {
      title
    }
    responsive_accounts {
      id
    }
  }
`;

export const ADD_ATTACHMENTS = gql`
  mutation add_attachments($attachments: [File!]!, $action_id: Uuid!) {
    add_attachments(attachments: $attachments, action_id: $action_id) {
      ...attachment
    }
  }

  fragment attachment on Attachment {
    id
    filename
    deleted_at
    file {
      url
    }
  }
`;

export const DELETE_ATTACHMENTS = gql`
  mutation remove_attachments($attachments: [String!]!, $action_id: Uuid!) {
    remove_attachments(attachments: $attachments, action_id: $action_id) {
      ...attachment
    }
  }

  fragment attachment on Attachment {
    id
    filename
    deleted_at
    file {
      url
    }
  }
`;

export const DELETE_ACTION = gql`
  mutation ($action_id: Uuid!) {
    delete_action(action_id: $action_id) {
      ...action
    }
  }

  fragment action on Action {
    id
    name
    created_at
    updated_at
    start_at
    end_at
    description
    number
    deleted_at
    creator {
      id
    }
    attachments {
      id
    }
    responsive_tags {
      title
    }
    responsive_accounts {
      id
    }
  }
`;

// ------------- SUB ACTIONS ---------------------
export const CREATE_SUB_ACTION = gql`
  mutation (
    $sub_action: CreateSubActionInput!
    $attachments: [File!]
    $action_id: Uuid!
  ) {
    create_sub_action(
      sub_action: $sub_action
      attachments: $attachments
      action_id: $action_id
    ) {
      ...subaction
    }
  }

  fragment subaction on SubAction {
    id
    name
    created_at
    updated_at
    start_at
    end_at
    description
    number
    creator {
      id
    }
    parent_action {
      id
    }
    attachments {
      id
      deleted_at
    }
    responsive_tags {
      title
    }
    responsive_accounts {
      id
    }
  }
`;

export const OVERDUE_ACTIONS = gql`
  query actions(
    $filter: ActionFilter
    $pagination: Pagination
    $order: ActionOrder
  ) {
    actions(filter: $filter, pagination: $pagination, order: $order) {
      nodes {
        ...action
      }
      page
      size
      pages
      total
      __typename
    }
  }

  fragment action on Action {
    id
    name

    start_at
    end_at
    status
    sub_actions {
      ...sub_action
    }
  }

  fragment sub_action on SubAction {
    id
    name
    start_at
    end_at
    status
  }
`;
