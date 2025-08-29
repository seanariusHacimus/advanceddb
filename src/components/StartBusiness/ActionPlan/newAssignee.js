import Axios from '../../../utils/axios';
import { CREATE_ORGANIZATION } from '../../../graphql/organizations';
import { REGISTER_DUMMY_ACCOUNT } from '../../../graphql/members';

const createNewOrganization = async (title) => {
  try {
    const res = await Axios.post('/graphql', {
      query: CREATE_ORGANIZATION,
      variables: {
        organization: {
          title,
        }
      }
    });
    if (res.data) {
      return { success: true, data: res.data.data.create_organization }
    }
  }
  catch (err) {
    const msg = err.response.data?.errors[0]?.extensions?.validation?.title[0]
    return { success: false, error: err.message, msg }
  }
}

const createNewMember = async (first_name, group_id) => {
  try {
    const res = await Axios.post('/graphql', {
      query: REGISTER_DUMMY_ACCOUNT,
      variables: {
        account: {
          first_name,
          last_name: null,
          groups: group_id
        }
      }
    });
    if (res.data) {
      return { success: true, data: res.data.data.register_dummy_account }
    }
  }
  catch (err) {
    return { success: false, error: err.message, msg: err.message }
  }
}

export { createNewMember, createNewOrganization };
