import Axios from "../../utils/axios";
import { FETCH_STATISTICS } from "../../graphql/dashboard";
import constants from "../../constants";

export const fetchStatistics = async () => {
  try {
    const res = await Axios.post("/graphql", {
      query: FETCH_STATISTICS,
      variables: {
        filter: {},
        unit: "months",
        last_n: 6,
      },
    });
    if (res?.data) {
      const {
        action_period_stats,
        action_stats,
        history: [indicators],
        indicator_groups,
      } = res.data.data;

      return {
        period: action_period_stats.values,
        actions: action_stats,
        db_score_and_rank: indicators
          ? indicators?.indicators?.ease_of_doing_business
          : {
              rank: constants.doingBusiness.rank,
              score: constants.doingBusiness.score,
            },
        workingGroups: indicator_groups.nodes,
      };
    }
    return {
      period: [],
      actions: [],
      db_score_and_rank: {
        rank: constants.doingBusiness.rank,
        score: constants.doingBusiness.score,
      },
      workingGroups: [],
    };
  } catch (err) {
    console.error("[Custom Catch Error]-->", err);
    return {
      period: [],
      actions: [],
      db_score_and_rank: {
        rank: constants.doingBusiness.rank,
        score: constants.doingBusiness.score,
      },
      workingGroups: [],
    };
  }
};
