import React from "react";
import { 
  StatCard, 
  CardHeader, 
  CardTitle, 
  StatCardContent,
  ProgressList,
  ProgressListItem
} from "../../../UI/shadcn";
import { ChevronsUpDown } from "lucide-react";
import PropTypes from "prop-types";
import { useLocale } from "../../../../utils/locale";

const TaskProgress = ({ actions }) => {
  const [t] = useLocale();

  return (
    <StatCard>
        <CardHeader style={{ position: 'relative' }}>
          <CardTitle>{t("Task progress")}</CardTitle>
          {actions.length > 4 && (
            <div style={{ 
              position: 'absolute', 
              right: '20px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'hsl(var(--muted-foreground))',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}>
              <ChevronsUpDown size={14} />
            </div>
          )}
        </CardHeader>
        <StatCardContent style={{ maxHeight: '280px', overflowY: 'auto', position: 'relative' }}>
          <ProgressList>
            {actions.map((item) => {
              const { total, completed } = item.sub_action_stats || {};
              let percent = 0;

              if (total > 0) {
                percent = Math.round((completed / total) * 100);
              } else if (item.status === "completed") {
                percent = 100;
              }

              // All progress bars use shadcn blue color
              const color = 'hsl(221 83% 53%)';

              return (
                <ProgressListItem
                  key={item.id}
                  title={item.name}
                  percentage={percent}
                  color={color}
                />
              );
            })}
          </ProgressList>
        </StatCardContent>
      </StatCard>
  );
};

TaskProgress.propTypes = {
  actions: PropTypes.array.isRequired,
};

export default TaskProgress;

