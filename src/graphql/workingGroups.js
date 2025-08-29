import Axios from '../utils/axios';
import { gql } from '../utils';

export const fetchWorkingGroups = async (filter = {}) => {
  try {
    const res = await Axios.post('/graphql', { query: FETCH_WORKING_GROUPS, filter });
    if (res?.data) {
      return { data: res.data.data.indicator_groups.nodes, success: true };
    }
  } catch (err) {
    console.log(err.response);
    return { data: [], success: false };
  }
};

export const fetchWorkingGroupMemberIDs = async (filter = {}) => {
  try {
    const res = await Axios.post('/graphql', { query: FETCH_WORKING_GROUPS_MEMBER_IDS, filter });
    if (res?.data) {
      return { data: res.data.data.indicator_groups.nodes, success: true };
    }
  } catch (err) {
    console.log(err.response);
    return { data: [], success: false };
  }
};

export const updateWorkingGroups = async ({ id, group }) => {
  try {
    const res = await Axios.post('/graphql', {
      query: UPDATE_WORKING_GROUP,
      variables: {
        id,
        group,
      },
    });
    if (res?.data) {
      console.log(res.data);
      return { data: res.data.data.indicator_groups.nodes, success: true };
    }
  } catch (err) {
    console.log(err.response);
    return { data: [], success: false };
  }
};

export const FETCH_WORKING_GROUPS_MEMBER_IDS = gql`
  query indicator_groups(
    $filter: IndicatorGroupFilter
    $pagination: Pagination
    $order: IndicatorGroupOrder = { key: number, direction: asc }
  ) {
    indicator_groups(filter: $filter, pagination: $pagination, order: $order) {
      nodes {
        id
        title
        leaders {
          id
        }
        members {
          id
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

export const FETCH_WORKING_GROUPS = gql`
  query indicator_groups(
    $filter: IndicatorGroupFilter
    $pagination: Pagination
    $order: IndicatorGroupOrder = { key: number, direction: asc }
  ) {
    indicator_groups(filter: $filter, pagination: $pagination, order: $order) {
      nodes {
        ...indicator_group
      }
      page
      size
      pages
      total
      __typename
    }
  }

  fragment indicator_group on IndicatorGroup {
    id
    title
    number
    visible
    sidebar_visible
    removable
    icon {
      url
    }
    leaders {
      id
      email
      first_name
      last_name
      role
      status
      photo {
        url
      }
    }
    sub_action_stats {
      deleted
      not_started
      ongoing_past_deadline
      ongoing_within_deadline
      completed
      total
    }
    action_stats {
      not_started
      ongoing_past_deadline
      ongoing_within_deadline
      completed
      total
    }
    members {
      ...account
    }
    leaders {
      id
      first_name
      last_name
      photo {
        url
      }
    }
    my_role
    #   __typename
  }

  fragment account on Account {
    id
    email
    phone
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



export const FETCH_WORKING_GROUPS_BY_ID = gql`
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
    removable
    visible
    methodology
    what_to_reform
    __typename
  }
`;

export const CREATE_WORKING_GROUP = gql`
  mutation create_indicator_group(
    $group: CreateIndicatorGroupInput!
    $members: [Uuid!]!,
    $leaders: [Uuid!]!
  ) {
    create_indicator_group(group: $group, leaders: $leaders, members: $members) {
      ...indicator_group
    }
  }

  fragment indicator_group on IndicatorGroup {
    id
    title
    leaders {
      email
    }
    removable
    visible
    __typename
  }
`;

export const UPDATE_WORKING_GROUP = gql`
  mutation update_indicator_group(
    $group: UpdateIndicatorGroupInput!
    $id: Uuid!,
    $members: [Uuid!],
    $leaders: [Uuid!]
  ) {
    update_indicator_group(group: $group, id: $id, leaders: $leaders, members: $members) {
      ...indicator_group
    }
  }

  fragment indicator_group on IndicatorGroup {
    id
    title
    methodology
    what_to_reform
    removable
    visible
    storage
    leaders {
      email
    }
    __typename
  }
`;

export const ADD_MEMBERS_MUTATION = gql`
  mutation add_group_members($members: [Uuid!]!, $group_id:Uuid!) {
    add_group_members(group_id: $group_id, members: $members) {
      ...indicator_group
    }
  }

  fragment indicator_group on IndicatorGroup {
    id
    title
    leaders {
      email
    }
    members {
      email
    }
  }
`;

export const REMOVE_MEMBERS_MUTATION = gql`
  mutation remove_group_members($members: [Uuid!]!, $group_id: Uuid!) {
    remove_group_members(members: $members, group_id: $group_id) {
      ...indicator_group
    }
  }

  fragment indicator_group on IndicatorGroup {
    id
    title
    leaders {
      email
    }
    removable
    visible
    members {
      email
    }
    __typename
  }
`;

export const DELETE_WORKING_GROUP = gql`
  mutation delete_indicator_group($id: Uuid!) {
    delete_indicator_group(id: $id) {
      ...indicator_group
    }
  }

  fragment indicator_group on IndicatorGroup {
    id
    title
    methodology
    icon {
      download_url
    }
    removable
    visible
    deleted_at
    what_to_reform
    storage
    leaders {
      email
    }
    __typename
  }
`;
