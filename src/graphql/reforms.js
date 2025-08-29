import { gql } from "../utils";

export const FETCH_REFORMS = gql`
  query reforms(
    $filter: ReformFilter
    $pagination: Pagination
    $order: ReformOrder
  ) {
    reforms(filter: $filter, pagination: $pagination, order: $order) {
      nodes {
        ...reform
      }
      page
      size
      pages
      total
      __typename
    }
  }

  fragment reform on Reform {
    id
    created_at
    #   creator {
    #     id
    #   }
    date_of_entry
    description
    geo_impact
    creator {
      first_name
      last_name
    }
    suggested_data_modification
    group {
      id
      title
    }
    legal_basis
    sub_index_impacted
    type_of_update
  }
`;

export const CREATE_REFORM = gql`
  mutation($reform: CreateReformInput!, $attachments: [File!]) {
    create_reform(reform: $reform, attachments: $attachments) {
      ...reform
    }
  }

  fragment reform on Reform {
    id
    created_at
    creator {
      id
    }
    date_of_entry
    description
    geo_impact
    group {
      id
    }
    attachments {
      id
      file {
        url
      }
    }
    legal_basis
    sub_index_impacted
    type_of_update
  }
`;

export const UPDATE_REFORM = gql`
  mutation($reform: UpdateReformInput!, $reform_id: IntegerString!) {
    update_reform(reform: $reform, reform_id: $reform_id) {
      ...reform
    }
  }

  fragment reform on Reform {
    id
    legal_basis
    created_at
    #   creator {
    #     id
    #   }
    date_of_entry
    description
    geo_impact
    group {
      id
    }
    attachments {
      id
      file {
        url
      }
    }

    sub_index_impacted
    type_of_update
  }
`;

export const DELETE_REFORM = gql`
  mutation($reform_id: IntegerString!) {
    delete_reform(reform_id: $reform_id) {
      ...reform
    }
  }

  fragment reform on Reform {
    id
    created_at
    #   creator {
    #     id
    #   }
    date_of_entry
    description
    geo_impact
    group {
      id
    }
    attachments {
      id
      file {
        url
      }
    }
    legal_basis
    sub_index_impacted
    type_of_update
  }
`;

export const ADD_ATTACHMENT = gql`
  mutation add_attachments(
    $attachments: [File!]!
    $action_id: Uuid
    $reform_id: IntegerString
  ) {
    add_attachments(
      attachments: $attachments
      action_id: $action_id
      reform_id: $reform_id
    ) {
      ...attachment
    }
  }

  fragment attachment on Attachment {
    id
    filename
    file {
      url
    }
  }
`;

export const REMOVE_ATTACHMENT = gql`
  mutation remove_attachments(
    $attachments: [String!]!
    $action_id: Uuid
    $reform_id: IntegerString
  ) {
    remove_attachments(
      attachments: $attachments
      action_id: $action_id
      reform_id: $reform_id
    ) {
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
