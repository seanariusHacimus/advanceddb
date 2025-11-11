import React, { useState } from "react";
import { 
  Col, 
  StatCard, 
  CardHeader, 
  CardTitle, 
  StatCardContent,
  CardFooter,
  Button,
  ProgressList,
  ProgressListItem
} from "../../../UI/shadcn";
import { ChevronDown, ChevronUp } from "lucide-react";
import PropTypes from "prop-types";
import { useLocale } from "../../../../utils/locale";

const INITIAL_ITEMS_TO_SHOW = 5;

const TaskProgress = ({ actions }) => {
  const [t] = useLocale();
  const [showAll, setShowAll] = useState(false);

  const displayedActions = showAll ? actions : actions.slice(0, INITIAL_ITEMS_TO_SHOW);
  const hasMore = actions.length > INITIAL_ITEMS_TO_SHOW;

  return (
    <Col xs={24} md={8} lg={9}>
      <StatCard>
        <CardHeader>
          <CardTitle>{t("Task progress")}</CardTitle>
        </CardHeader>
        <StatCardContent>
          <ProgressList>
            {displayedActions.map((item) => {
              const { total, completed } = item.sub_action_stats || {};
              let percent = 0;

              if (total > 0) {
                percent = Math.round((completed / total) * 100);
              } else if (item.status === "completed") {
                percent = 100;
              }

              // Определяем цвет на основе прогресса
              let color = 'hsl(var(--primary))';
              if (percent === 100) {
                color = 'hsl(var(--success))';
              } else if (percent < 30) {
                color = 'hsl(var(--destructive))';
              } else if (percent < 70) {
                color = 'hsl(45 93% 47%)';
              }

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
        {hasMore && (
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              style={{ width: '100%' }}
            >
              {showAll ? (
                <>
                  <ChevronUp size={16} />
                  {t("Show less")}
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  {t("Show all")} ({actions.length - INITIAL_ITEMS_TO_SHOW} {t("more")})
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </StatCard>
    </Col>
  );
};

TaskProgress.propTypes = {
  actions: PropTypes.array.isRequired,
};

export default TaskProgress;

