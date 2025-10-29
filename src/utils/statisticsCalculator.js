import moment from "moment-timezone";
import { indicatorStatus } from "../constants";

export const getDonutChartData = (data) => {
  const keys = Object.keys(data);
  const result = [];

  keys.forEach((item) => {
    let color = "";
    if (item === "completed") {
      color = "#527BDD";
    } else if (item === "not_started") {
      color = "#E5E7EF";
    } else if (item === "ongoing_within_deadline") {
      color = "#F4D581";
    } else if (item === "on_review") {
      color = "#f3f3f3";
    } else {
      color = "#F4C9D9";
    }

    const value = {
      name: item,
      value: Number(parseFloat((data[item] / data.total) * 100, 10).toFixed(1)),
      title: indicatorStatus[item],
      count: data[item],
      color,
    };
    if (item !== "total" && item !== "deleted") {
      result.push(value);
    }
  });

  result.reverse();

  return result;
};

export const areaChartStatistics = (data, totalActions) => {
  return data
    .map((item) => {
      const { created_count, completed_count: completed, time_offset } = item;
      const total = created_count ? created_count : 1;
      const percent = total
        ? parseFloat((completed / (totalActions ? totalActions : 1)) * 100, 10)
        : 0;
      const period = moment().subtract(time_offset, "month").format("MMMM");

      return { value: Number(percent.toFixed(1)), name: period };
    })
    .reverse();
};
