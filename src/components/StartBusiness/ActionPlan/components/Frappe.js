import React, { ReactDOM } from "react";
import { FrappeGantt } from "frappe-gantt-react-extended-v2";
import { StyledGantt } from "../../../../styles/graph";
import { Flex } from "../../../../styles";
import { ZoomIn, ZoomOut } from "lucide-react";
import { withLocale } from "../../../../utils/locale";

const tasks = [
  {
    id: "Task 1",
    name: "Task 1",
    start: new Date(),
    end: new Date(),
    progress: 10,
    dependencies: "",
  },
];

class GanttChart extends React.Component {
  state = { data: tasks, viewMode: "Month", zoom: 1, hiddendActions: [] };

  componentDidMount() {
    let monsterData = [];
    this.props.data.forEach((item, index) => {
      const {
        id,
        name,
        sub_actions,
        sub_action_stats,
        status,
        start_at,
        end_at,
      } = item;

      const parentAction = {
        id,
        name: `${index + 1}. ${name}`,
        start: new Date(start_at),
        end: new Date(end_at),
        progress:
          (sub_action_stats.completed / sub_action_stats.total) * 100 || 0,
        custom_class: `${status} parent`,
        dependencies: sub_actions.map((i) => i.id).toString(),
        isChild: false,
      };

      const childActions = sub_actions.map((item, count) => {
        const { id, name, status, start_at, end_at } = item;
        return {
          id,
          name: `${index + 1}.${count + 1}.${name}`,
          start: new Date(start_at),
          end: new Date(end_at),
          custom_class: `${status} child`,
          isChild: true,
        };
      });
      monsterData.push(parentAction, ...childActions);
    });
    this.setState({ data: monsterData });
  }

  setCorrectHeightOfTodayHighlight = () => {
    const findTodayLine =
      this.ganttChartRef?._target?.current?.querySelector(".today-highlight");
    const getStyle = findTodayLine && window.getComputedStyle(findTodayLine);
    findTodayLine.setAttribute("height", parseInt(getStyle.height) - 60);
    findTodayLine.setAttribute("y", 60);
  };

  componentDidUpdate() {
    if (this.state.viewMode === "Day") {
      this.setCorrectHeightOfTodayHighlight();
    }
  }

  sortActions = (id, status) => {
    console.log(id, status);
    const { hiddendActions } = this.state;
    let monsterData = [];
    this.props.data.forEach((item, index) => {
      const {
        id,
        name,
        sub_actions,
        sub_action_stats,
        status,
        start_at,
        end_at,
      } = item;

      const parentAction = {
        id,
        name: `${index + 1}. ${name}`,
        start: new Date(start_at),
        end: new Date(end_at),
        progress:
          (sub_action_stats.completed / sub_action_stats.total) * 100 || 0,
        custom_class: `${status} parent`,
        dependencies: sub_actions.map((i) => i.id).toString(),
        isChild: false,
      };
      if (!hiddendActions.includes(id)) {
        const childActions = sub_actions.map((item, count) => {
          const { id, name, status, start_at, end_at } = item;
          return {
            id,
            name: `${index + 1}.${count + 1}.${name}`,
            start: new Date(start_at),
            end: new Date(end_at),
            custom_class: `${status} child`,
            isChild: true,
          };
        });
        return monsterData.push(parentAction, ...childActions);
      }

      return monsterData.push(parentAction);
    });
    this.setState({ data: monsterData });
  };

  zoomHandler = (type) => {
    const { zoom } = this.state;
    if (type === "in" && zoom < 3) {
      this.setState((prevState) => ({
        zoom: +parseFloat((prevState.zoom += 0.1)).toFixed(1),
      }));
    } else if (type === "out" && zoom > 0.4) {
      this.setState((prevState) => ({
        zoom: +parseFloat((prevState.zoom -= 0.1)).toFixed(1),
      }));
    }
  };

  render() {
    const { viewMode, zoom } = this.state;
    const ganttWidth = this.ganttChartRef?._svg.current.clientWidth;
    const { t } = this.props;
    return (
      <StyledGantt
        zoom={zoom}
        ganttWidth={ganttWidth}
        ref={this.props.printRef}
        clientWidth={document.body.clientWidth}
      >
        <div className="gantt-control">
          <select
            className="gantt-select"
            name="viewMode"
            value={viewMode}
            onChange={(e) => this.setState({ viewMode: e.target.value })}
          >
            <option value="Day">{t("Day")}</option>
            <option value="Week">{t("Week")}</option>
            <option value="Month">{t("Month")}</option>
          </select>
          <div className="zoom-wrapper">
            <button 
              onClick={() => this.zoomHandler("out")}
              title={t("Zoom out")}
              aria-label={t("Zoom out")}
              disabled={zoom <= 0.4}
            >
              <ZoomOut size={14} />
            </button>
            <span>{(zoom * 100).toFixed(0)}%</span>
            <button 
              onClick={() => this.zoomHandler("in")}
              title={t("Zoom in")}
              aria-label={t("Zoom in")}
              disabled={zoom >= 3}
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
        <FrappeGantt
          tasks={this.state.data}
          ref={(el) => (this.ganttChartRef = el)}
          viewMode={viewMode}
          popupMode={"mouseover"}
          popup_trigger={() => console.log("hey")}
          changePopupMode={() => console.log("hey")}
          style={{ overflow: "hidden" }}
          onClick={(task) => {
            if (task.custom_class.includes("parent")) {
              if (this.state.hiddendActions.includes(task.id)) {
                this.sortActions(task.id, "show");
                const hiddendActions = this.state.hiddendActions.filter(
                  (item) => item !== task.id
                );
                this.setState({ hiddendActions }, () =>
                  this.sortActions(task.id)
                );
              } else {
                this.setState(
                  (prevState) => ({
                    hiddendActions: [...prevState.hiddendActions, task.id],
                  }),
                  () => {
                    return this.sortActions(task.id, "hide");
                  }
                );
              }
            }
          }}
          onViewChange={(mode) => {
            console.log(mode);
            // var bars = document.querySelectorAll(id + " .bar-group");
            // for (var i = 0; i < bars.length; i++) {
            //   bars[i].addEventListener("mousedown", stopEvent, true);
            // }
            // var handles = document.querySelectorAll(id + " .handle-group");
            // for (var i = 0; i < handles.length; i++) {
            //   handles[i].remove();
            // }
          }}
          onDateChange={(task, start, end) => {
            console.log(task, start, end, "date");
          }}
          onProgressChange={(task, progress) => {
            console.log(task, progress, "progress");
          }}
          onMouseMove={(data) => {}}
          customPopupHtml={(task) => {}}
          onTasksChange={(tasks) => {}}
        />
      </StyledGantt>
    );
  }
}

export default withLocale(GanttChart);
