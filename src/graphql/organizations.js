import Axios from '../utils/axios';
import { gql } from "../utils";

export const FETCH_ORGANIZATIONS = gql`
  query {
    organizations(filter: {}) {
      nodes {
        id
        title
      }
    }
  }
`;

export const CREATE_ORGANIZATION = gql`
  mutation create_organization($organization: CreateOrganizationInput!) {
    create_organization(organization: $organization) {
      ...organization
    }
  }
  fragment organization on Organization {
    id
    title
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation update_organization($organization: UpdateOrganizationInput!, $id: Uuid!) {
    update_organization(organization: $organization, id: $id) {
      ...organization
    }
  }

  fragment organization on Organization {
    id
    title
  }
`;

export const fetchOrganizations = async () => {
  try {
    const res = await Axios.post('/graphql', {
      query: FETCH_ORGANIZATIONS,
      variables: {
        pagination: {
          size: -1
        }
      },
    });
    if (res?.data) {
      return res.data.data.organizations.nodes;
    }
  } catch (err) {
    return [];
  }
}

export const createOrganization = async (title) => {
  try {
    const res = await Axios.post('/graphql', {
      query: CREATE_ORGANIZATION,
      variables: {
        organization: { title },
      },
    });
    if (res?.data) {
      return res.data;
    }
  } catch (err) {
    return err.response;
  }
}

export const updateOrganizations = async (id, title) => {
  try {
    const res = await Axios.post('/graphql', {
      query: UPDATE_ORGANIZATION,
      variables: {
        organization: { title },
        id
      },
    });
    if (res?.data) {
      return res.data;
    }
  } catch (err) {
    return err.response;
  }

}