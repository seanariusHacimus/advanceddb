import Axios from "../../../../utils/axios";
import { FETCH_ORGANIZATIONS } from "../../../../graphql/organizations";
import { FETCH_TAGS } from "../../../../graphql/tags";
import { indexBy } from "../../../../utils";

export const getAllGroupAccounts = (
  selectedWorkingGroup,
  responsive_accounts = []
) => {
  const allAccounts = [
    ...selectedWorkingGroup.members,
    ...responsive_accounts,
    ...selectedWorkingGroup.leaders,
  ].filter((account) => account.status === "active");
  return indexBy(allAccounts, "id");
};

export const getAllOrganizations = async () => {
  const res = await Axios.post("/graphql", {
    query: FETCH_ORGANIZATIONS,
  });
  if (res?.data) {
    const allOrganizations = res.data.data.organizations?.nodes;
    return indexBy(allOrganizations, "id");
  }
};

export const getAllTags = async () => {
  const res = await Axios.post("/graphql", {
    query: FETCH_TAGS,
  });
  if (res?.data) {
    return res.data.data.tags?.nodes;
  }
};
