import React, { PureComponent, lazy, Suspense } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Axios from "../../utils/axios";
import {
  UPDATE_WORKING_GROUP,
  FETCH_WORKING_GROUPS_BY_ID,
} from "../../graphql/workingGroups";
import { groupTitleToUrl } from "../../utils";
import { withLocale } from "../../utils/locale";
import { Button } from "../UI/shadcn";
import { Edit, Save } from "lucide-react";

const Editor = lazy(() => import("../UI/Editor/Editor.js"));

const MethodologyContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

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
      <MethodologyContainer>
        <div className="has-box-shadow editor">
          {selectedWorkingGroup.permissions.methodology.update && (
            <ButtonContainer>
              <Button
                variant="outline"
                onClick={() =>
                  this.setState((prevState) => ({ edit: !prevState.edit }))
                }
              >
                <Edit size={16} style={{ marginRight: '8px' }} />
                {edit ? t("Cancel") : t("Edit")}
              </Button>
            </ButtonContainer>
          )}

          {edit && (
            <Suspense fallback={t("Loading...")}>
              <Editor
                height={500}
                onChange={this.inputHandler}
                value={methodology || this.props.selectedWorkingGroup.methodology}
              />
              <ButtonContainer style={{ marginTop: '24px' }}>
                <Button onClick={this.submitReform}>
                  <Save size={16} style={{ marginRight: '8px' }} />
                  {t("Save")}
                </Button>
              </ButtonContainer>
            </Suspense>
          )}
          {!edit && (
            <div
              className="editor-content"
              dangerouslySetInnerHTML={{
                __html:
                  methodology || this.props.selectedWorkingGroup.methodology,
              }}
            ></div>
          )}
        </div>
      </MethodologyContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.account,
  indicators: state.workingGroups.data,
  selectedWorkingGroup: state.selectedWorkingGroup,
});

export default connect(mapStateToProps)(withLocale(Methodology));
