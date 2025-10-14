export const USER_ROLES = {
  SUPERUSER: "superuser",
  COORDINATOR: "coordinator",
  MEMBER: "member",
  OBSERVER: "observer",
  LEADER: "leader",
  PARTICIPANT: "participant",
};

export const USER_PERMISSIONS = [
  {
    title: "Deny/Approve access requests",
    superUser: true,
    coordinator: {
      text: "Leaders or members",
      tooltip: "Can deny/Approve only leader's or member's access request",
    },
    leader: {
      text: "Only members",
      tooltip: "Can deny/Approve only member's access request",
    },
    member: false,
  },
  {
    title: "Invite a user",
    superUser: true,
    coordinator: {
      text: "Leaders or members",
      tooltip: "Can invite only leaders or members",
    },
    leader: { text: "Members", tooltip: "Can invite only members" },
    member: false,
  },
  {
    title: "Cancel user invitation",
    superUser: true,
    coordinator: {
      text: "Leaders or members",
      tooltip: "Can cancel only leaders or members invitation",
    },
    leader: { text: "Members", tooltip: "Can cancel only member's invitation" },
    member: false,
  },
  {
    title: "Resend user invitation",
    superUser: true,
    coordinator: {
      text: "Leaders or members",
      tooltip: "Can resend only leader's or member's invitation",
    },
    leader: { text: "Members", tooltip: "Can resend only member's invitation" },
    member: false,
  },
  {
    title: "Update a user",
    superUser: true,
    coordinator: false,
    leader: false,
    member: { text: "Self", tooltip: "Can update only own account" },
  },
  {
    title: "Create an (sub)action",
    superUser: true,
    coordinator: true,
    leader: {
      text: "Group",
      tooltip:
        "Can create an action only in working group where he participates",
    },
    member: {
      text: "Group",
      tooltip:
        "Can create an action only in working group where he participates",
    },
  },
  {
    title: "Delete an (sub)action",
    superUser: true,
    coordinator: true,
    leader: {
      text: "Group",
      tooltip:
        "Can delete an action only in working group where he participates",
    },
    member: {
      text: "Self",
      tooltip: "Can delete an action only created by himself",
    },
  },
  {
    title: "Update an (sub)action",
    superUser: true,
    coordinator: true,
    leader: {
      text: "Group",
      tooltip:
        "Can update an action only in working group where he participates",
    },
    member: {
      text: "Group",
      tooltip:
        "Can update an action only in working group where he participates",
    },
  },
  {
    title: "Complete/Uncomplete (sub)action",
    superUser: true,
    coordinator: true,
    leader: {
      text: "Group",
      tooltip:
        "Can complete an action only in working group where he participates",
    },
    member: {
      text: "Group",
      tooltip:
        "Can complete an action only in working group where he participates",
    },
  },
  {
    title: "Add account to working group",
    superUser: true,
    coordinator: true,
    leader: {
      text: "Group",
      tooltip: "Can add any account to working group where he participates",
    },
    member: false,
  },
  {
    title: "Create a working group",
    superUser: true,
    coordinator: true,
    leader: false,
    member: false,
  },
  {
    title: "Delete a working group",
    superUser: true,
    coordinator: true,
    leader: false,
    member: false,
  },
  {
    title: "Update a working group",
    superUser: true,
    coordinator: true,
    leader: false,
    member: false,
  },
  {
    title: "Create a meeting minute",
    superUser: true,
    coordinator: true,
    leader: {
      text: "Group",
      tooltip:
        "Can create a meeting minute in working group where he participates",
    },
    member: {
      text: "Group",
      tooltip:
        "Can create a meeting minute in working group where he participates",
    },
  },
  {
    title: "Delete a meeting minute",
    superUser: true,
    coordinator: true,
    leader: {
      text: "Group",
      tooltip:
        "Can delete a meeting minute in working group where he participates",
    },
    member: {
      text: "Group",
      tooltip: "Can delete a meeting minute created by himself",
    },
  },
  {
    title: "Update a meeting minute",
    superUser: true,
    coordinator: true,
    leader: {
      text: "Group",
      tooltip:
        "Can update a meeting minute in working group where he participates",
    },
    member: {
      text: "Group",
      tooltip:
        "Can update a meeting minute in working group where he participates",
    },
  },
  {
    title: "Create an organization",
    superUser: true,
    coordinator: true,
    leader: true,
    member: true,
  },
  {
    title: "Create a DB reform update",
    superUser: true,
    coordinator: true,
    leader: true,
    member: true,
  },
  {
    title: "Delete a DB reform update",
    superUser: true,
    coordinator: true,
    leader: false,
    member: false,
  },
  {
    title: "Update a DB reform update",
    superUser: true,
    coordinator: true,
    leader: false,
    member: false,
  },
];
