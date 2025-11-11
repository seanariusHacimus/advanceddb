import React from "react";
import { 
  Col, 
  StatCard, 
  CardHeader, 
  CardTitle, 
  StatCardContent,
  PieChart
} from "../../../UI/shadcn";
import { useLocale } from "../../../../utils/locale";
import PropTypes from "prop-types";

const ActionStatuses = ({ chartData }) => {
  const [t] = useLocale();

  // Transform chartData to match PieChart format
  const pieData = chartData.map(item => ({
    label: t(item.title),
    value: item.value || 0,
    color: item.color
  }));

  return (
    <Col xs={24} md={8} lg={6}>
      <StatCard>
        <CardHeader>
          <CardTitle>{t("Overall progress of tasks")}</CardTitle>
        </CardHeader>
        <StatCardContent>
          <PieChart data={pieData} size={220} />
        </StatCardContent>
      </StatCard>
    </Col>
  );
};

ActionStatuses.propTypes = {
  chartData: PropTypes.array.isRequired,
};

export default ActionStatuses;

