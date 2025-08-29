import constants from '../constants';

const currentYear = new Date().getFullYear();

export const FETCH_STATISTICS = `
  query($filter: ActionFilter, $unit: ChronoUnit, $last_n: Int) {
    action_stats {
      deleted
      not_started
      ongoing_past_deadline
      ongoing_within_deadline
      completed
      total
    }

    history(country: ${constants.defaultCountry.code}, year: ${currentYear}) {
      indicators {
        ease_of_doing_business {
          ease_of_doing_business_rank
          ease_of_doing_business_score_db17_20
        }
      }
    }

    action_period_stats(unit: $unit, last_n: $last_n) {
      anchor_date
      unit
      values {
        deleted_count
        completed_count
        created_count
        time_offset
      }
    }

    indicator_groups(order: {key: number, direction: asc}){
      nodes {
        id
        title
        visible
        action_stats {
          not_started
          ongoing_past_deadline
          ongoing_within_deadline
          completed
          total
        }
      }
    }
  }
`;
