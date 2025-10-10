import React, { PureComponent, lazy, Suspense } from "react";
import { ButtonPrimary, Button, Flex } from "../../styles";
import { connect } from "react-redux";
import Axios from "../../utils/axios";
import {
  UPDATE_WORKING_GROUP,
  FETCH_WORKING_GROUPS_BY_ID,
} from "../../graphql/workingGroups";
import iconEdit from "../../assets/startBusiness/edit.svg";
import { groupTitleToUrl } from "../../utils";
import { withLocale } from "../../utils/locale";

const Editor = lazy(() => import("../../utils/Editor.js"));

class Methodology extends PureComponent {
  state = { edit: false };

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
        console.log(res.data);
        const { nodes } = res.data.data.indicator_group_infos;
        this.setState({ ...nodes[0], loading: false });
      }
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  }

  inputHandler = (val) => {
    this.setState({ methodology: val });
  };

  submitReform = async () => {
    const { methodology } = this.state;

    if (methodology !== this.props.selectedWorkingGroup.methodology) {
      try {
        const res = await Axios.post("/graphql", {
          query: UPDATE_WORKING_GROUP,
          variables: {
            id: this.props.selectedWorkingGroup.id,
            group: { methodology },
          },
        });
        if (res?.data) {
          this.setState({ edit: false });
        }
      } catch (err) {
        console.log(err.response);
      }
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { t } = this.props;
    const { methodology, edit } = this.state;
    const { selectedWorkingGroup } = this.props;
    return (
      <div className="has-box-shadow editor">
        {selectedWorkingGroup.permissions.methodology.update && (
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
              <img src={iconEdit} alt="added btn" /> {t("Edit")}
            </Button>
          </Flex>
        )}

        {edit && (
          <Suspense fallback={t("Loading...")}>
            <Editor
              advanced
              height={500}
              toolbar_location="top"
              onChange={this.inputHandler}
              value={methodology || this.props.selectedWorkingGroup.methodology}
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
          <div
            dangerouslySetInnerHTML={{
              __html:
                methodology || this.props.selectedWorkingGroup.methodology,
            }}
          ></div>
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

export default connect(mapStateToProps)(withLocale(Methodology));
