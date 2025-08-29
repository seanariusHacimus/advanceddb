
export default (data) => {
  const keys = Object.keys(data);
  const result = [];

  keys.map(item => {
    let color = '';
    if (item === 'completed') {
      color = '#527BDD';
    } else if (item === 'not_started') {
      color = '#E5E7EF';
    } else if (item === 'ongoing_within_deadline') {
      color = '#F4D581';
    } else {
      color = '#F4C9D9';
    }

    const value = {
      name: item,
      value: parseInt(data[item] / data.total * 100),
      title: item.replace(/_/g, ' '),
      color,
    }
    if (item !== 'total' && item !== 'deleted') {
      result.push(value);
    }

  });

  return result;
}
