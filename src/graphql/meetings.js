import { gql } from "../utils";

export const FETCH_MEETINGS = gql`
  query meeting_minutes(
    $filter: MeetingMinuteFilter
    $pagination: Pagination
    $order: MeetingMinuteOrder
  ) {
    meeting_minutes(filter: $filter, pagination: $pagination, order: $order) {
      nodes {
        ...meeting_minute
      }
      page
      size
      pages
      total
      __typename
    }
  }

  fragment meeting_minute on MeetingMinute {
    id
    name
    created_at
    date
    attachments {
      id
      file {
        url
      }
      filename
    }
    creator {
      id
      first_name
      last_name
    }
    comment
    group {
      id
    }
  }
`;

export const CREATE_MEETING = gql`
  mutation($meeting_minute: CreateMeetingMinuteInput!, $attachments: [File!]) {
    create_meeting_minute(
      meeting_minute: $meeting_minute
      attachments: $attachments
    ) {
      ...meeting_minute
    }
  }

  fragment meeting_minute on MeetingMinute {
    id
    name
    created_at
    date
    creator {
      id
    }
    attachments {
      id
      file {
        url
      }
    }
    comment
    group {
      id
    }
  }
`;

export const DELETE_MEETING = gql`
  mutation($meeting_minute_id: Uuid!) {
    delete_meeting_minute(meeting_minute_id: $meeting_minute_id) {
      ...meeting_minute
    }
  }

  fragment meeting_minute on MeetingMinute {
    id
    name
    created_at
    date
    attachments {
      id
      file {
        url
      }
    }
    creator {
      id
    }
    comment
    group {
      id
    }
    deleted_at
  }
`;

export const UPDATE_MEETING = gql`
  mutation(
    $meeting_minute: UpdateMeetingMinuteInput!
    $meeting_minute_id: Uuid!
  ) {
    update_meeting_minute(
      meeting_minute: $meeting_minute
      meeting_minute_id: $meeting_minute_id
    ) {
      ...meeting_minute
    }
  }

  fragment meeting_minute on MeetingMinute {
    id
    name
    created_at
    date
    creator {
      id
    }
    attachments {
      id
      file {
        url
      }
    }
    comment
    group {
      id
    }
  }
`;

export const ADD_ATTACHMENTS = gql`
  mutation add_attachments($attachments: [File!]!, $meeting_minute_id: Uuid!) {
    add_attachments(
      attachments: $attachments
      meeting_minute_id: $meeting_minute_id
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

export const DELETE_ATTACHMENTS = gql`
  mutation remove_attachments(
    $attachments: [String!]!
    $meeting_minute_id: Uuid!
  ) {
    remove_attachments(
      attachments: $attachments
      meeting_minute_id: $meeting_minute_id
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
