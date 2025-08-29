export default (data) => {
  let query = '';
  for (let i = 0; i < data.length; i++) {
    const { id, number } = data[i];
    query += `
    \n\nupdate${i}: update_sub_action(action: {number: ${number}}, action_id: "${id}") {
        id
      }
    `
  }

  return query
};
