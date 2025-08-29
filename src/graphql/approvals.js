import { gql } from '../utils';

export const FETCH_APPROVAL_ACTIONS = gql`
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
        group {
          title
        }
        review_requested_at
        review_requester {
          id
          first_name
          last_name
        }
        status
      }
    }
    
    sub_actions(filter: $filterSubAction, pagination: $pagination, order: $orderSubAction) {
      nodes {
        id
        name
        group {
          title
        }
        review_requested_at
        review_requester {
          id
          first_name
          last_name
        }
        status
      }
    }
  }    
`;

export const FETCH_APPROVAL_ACTIONS_NUMBER = gql`
  query actions(
    $filter: ActionFilter
    $pagination: Pagination
    $order: ActionOrder
    $filterSubAction: SubActionFilter
    $orderSubAction: ActionOrder
  ) {
    actions(filter: $filter, pagination: $pagination, order: $order) {
      total
    }
    
    sub_actions(filter: $filterSubAction, pagination: $pagination, order: $orderSubAction) {
      total
    }
  }    
`;

export const APPROVE_ACTION = gql`
   mutation complete_action($id: Uuid!){
    complete_action(action_id: $id)
   }
`;

export const REJECT_ACTION = gql`
   mutation uncomplete_action($id: Uuid!){
    uncomplete_action(action_id: $id)
   }
`;

