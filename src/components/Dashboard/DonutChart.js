import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import constants from '../../constants';
import { withLocale } from "../../utils/locale";


class DonutChart extends PureComponent {
  render() {
    const { t } = this.props
    const { data = [{ value: 90 }, { value: 10 }] } = this.props;
    const completedTasks = data.find(item => item.name === 'completed');
    return (
      <div style={{ width: '100%', height: '100%', minHeight: 200, maxHeight: 260, position: 'relative' }}>
        <ResponsiveContainer>
          <PieChart margin={{
            top: 20, right: 0, left: 0, bottom: 5,
          }}>
            <Pie
              data={data}
              cx={'50%'}
              cy={'50%'}
              innerRadius={'65%'}
              outerRadius={'100%'}
              fill="#8884d8"
              dataKey="value"
              animationDuration={constants.animationSpeed}
            >
              {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
              }
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="value" style={styles.titleContainer}>
          <h3 style={styles.title}>{completedTasks?.value || 0}%</h3>
          <span style={styles.subTitle}>{t("completed")}</span>
        </div>
      </div>
    );
  }
}

const styles = {
  titleContainer: {
    position: 'absolute',
    top: '52%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: '25px',
    color: '#252A32',
    fontWeight: '500',
    marginBottom: 0,
  },
  subTitle: {
    color: '#A0A6B8'
  }
}

export default withLocale(DonutChart)
