import { gql } from "../utils";

export const FETCH_ACTIONS_FOR_PRINT = gql`
  query actions(
    $filter: ActionFilter
    $pagination: Pagination
    $order: ActionOrder
  ) {
    actions(filter: $filter, pagination: $pagination, order: $order) {
      nodes {
        ...action
      }
    }
  }

  fragment action on Action {
    name
    start_at
    end_at
    sub_actions {
      ...sub_action
    }
    responsive_tags {
      title
    }
    responsive_accounts {
      first_name
      last_name
    }
    status
  }

  fragment sub_action on SubAction {
    name
    start_at
    end_at
    status
    responsive_tags {
      title
    }
    responsive_accounts {
      first_name
      last_name
    }
  }
`;

export const FETCH_ACTIONS_AND_SUB_ACTIONS = gql`
  query actions(
    $filter: ActionFilter
    $pagination: Pagination
    $order: ActionOrder
    $filterSubAction: SubActionFilter
    $orderSubAction: ActionOrder
  ) {
    actions(filter: $filter, pagination: $pagination, order: $order) {
      nodes {
        id
        name
        start_at
        end_at
        group {
          title
        }
        responsive_tags {
          title
        }
        responsive_accounts {
          first_name
          last_name
          id
        }
        status
      }
    }

    sub_actions(
      filter: $filterSubAction
      pagination: $pagination
      order: $orderSubAction
    ) {
      nodes {
        id
        name
        start_at
        end_at
        status
        group {
          title
        }
        parent_action {
          id
        }
        responsive_tags {
          title
        }
        responsive_accounts {
          first_name
          last_name
          id
        }
      }
    }
  }
`;

export const FETCH_VISIBLE_INDICATOR_GROUPS = gql`
  {
    indicator_groups(filter: { sidebar_visible: true }) {
      nodes {
        sidebar_visible
        title
        id
      }
    }
  }
`;
