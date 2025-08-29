export default (data) => {
  let query = '';
  for (let i = 0; i < data.length; i++) {
    const { id, index } = data[i];
    console.log(index, data[i], typeof index);
    query += `
    \n\nupdate${i}: update_indicator_group(group: {number: ${index}}, id: "${id}") {
      id
      title
      number
      visible
      removable
      icon {
        url
      }
      members {
        email
      }
      }
    `
  }

  return query
};
