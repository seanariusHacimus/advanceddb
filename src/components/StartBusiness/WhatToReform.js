import React, { PureComponent, lazy, Suspense } from "react";
import { ButtonPrimary, Button, Flex } from "../../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Axios from "../../utils/axios";
import {
  FETCH_WORKING_GROUPS_BY_ID,
  UPDATE_WORKING_GROUP,
} from "../../graphql/workingGroups";
import { selectWorkingGroupAction } from "../../store/SelectedIndicator/actions";
import iconEdit from "../../assets/startBusiness/edit.svg";
import { groupTitleToUrl } from "../../utils";
import { withLocale } from "../../utils/locale";

const Editor = lazy(() => import("../UI/Editor/Editor.js"));

class WhatToReform extends PureComponent {
  state = { edit: false, loading: true };

  async componentDidMount() {
    const { title } = this.props.match.params;
    const currentIndicator = this.props.indicators.find((item) => {
      if (groupTitleToUrl(item.title) === title) {
        return item;
      }
      return;
    });
    try {
      const res = await Axios.post("/graphql", {
        query: FETCH_WORKING_GROUPS_BY_ID,
        variables: { filter: { title: currentIndicator.title } },
      });
      if (res?.data) {
        const { nodes } = res.data.data.indicator_group_infos;
        this.setState({ ...nodes[0], loading: false });
        this.props.selectWorkingGroupAction(nodes[0]);
      }
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
      this.setState({ loading: false });
    }
  }

  inputHandler = (val) => {
    this.setState({ what_to_reform: val });
  };

  submitReform = async () => {
    const { id, what_to_reform } = this.state;

    if (what_to_reform !== this.props.selectedWorkingGroup.what_to_reform) {
      try {
        const res = await Axios.post("/graphql", {
          query: UPDATE_WORKING_GROUP,
          variables: {
            id,
            group: { what_to_reform },
          },
        });
        if (res?.data) {
          this.setState({ edit: false });
        }
      } catch (err) {
        console.error("[Custom Catch Error]-->", err.response);
      }
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { what_to_reform, edit } = this.state;
    const { selectedWorkingGroup } = this.props;
    const { permissions } = selectedWorkingGroup;
    const { t } = this.props;
    return (
      <div className="has-box-shadow editor">
        {permissions.what_to_reform.update && (
          <Flex>
            <Button
              style={{
                width: "auto",
                padding: "5px 10px",
                marginLeft: "auto",
                marginBottom: 30,
              }}
              onClick={() =>
                this.setState((prevState) => ({ edit: !prevState.edit }))
              }
              className="print-btn transparent"
            >
              <img src={iconEdit} alt={t("added btn")} /> {t("Edit")}
            </Button>
          </Flex>
        )}

        {edit && (
          <Suspense fallback={t("Loading...")}>
            <Editor
              advanced
              onChange={this.inputHandler}
              value={what_to_reform}
              height={500}
            />
            <ButtonPrimary
              className="small"
              onClick={this.submitReform}
              style={{ maxWidth: 250, margin: "30px auto" }}
            >
              {t("Save")}
            </ButtonPrimary>
          </Suspense>
        )}
        {!edit && (
          <div dangerouslySetInnerHTML={{ __html: what_to_reform }}></div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.account,
  indicators: state.workingGroups.data,
  selectedWorkingGroup: state.selectedWorkingGroup,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ selectWorkingGroupAction }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocale(WhatToReform));
