import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { 
  Col, 
  Row, 
  Modal, 
  DatePicker, 
  Select, 
  Badge,
  Button as ShButton,
  Input,
  Label,
  FormGroup,
  Separator
} from "../../../UI/shadcn";
import moment from "moment-timezone";
import Axios from "../../../../utils/axios";
import { CREATE_ACTION } from "../../../../graphql/actions";
import {
  Button,
  ButtonPrimary,
  Flex,
  InputWrapper,
  StyledActionPlan,
  TitleH1,
  TitleH3,
} from "../../../../styles";
import { X } from "lucide-react";
import { fetchActionPlans } from "../../../../store/Actions/actions";
import {
  dissoc,
  ErrorAlerts,
  indexBy,
  InputErrors,
  parseErrors,
} from "../../../../utils";
import { withLocale } from "../../../../utils/locale";
import FileUpload from "../components/FileUpload";
import ActionNameSelection from "../components/ActionNameSelection";
import { Editor } from "../../../UI";
import { toast } from "react-toastify";
import { getCategoriesByPillar, getSubcategoriesByCategory } from "../util";
import { errorsConfig, initialState } from "./constants";
import {
  getAllGroupAccounts,
  getAllOrganizations,
  getAllTags,
} from "./helpers";

export {
  errorsConfig,
  initialState,
  getAllGroupAccounts,
  getAllOrganizations,
  getAllTags,
};

export class ActionPlanBase extends Component {
  state = { ...initialState, end_at_isGreater: false };
  membersRef = createRef();
  parentRef = createRef();

  componentDidMount() {
    getAllTags().then((tags) => {
      const allTags = tags.map(({ title }) => ({
        first_name: title,
        id: title,
        isTag: true,
      }));
      this.setState({
        allAccounts: getAllGroupAccounts(this.props.selectedWorkingGroup),
        allTags: indexBy(allTags, "id"),
      });
    });
  }

  refreshEntities = () => {
    const { responsive_accounts, responsive_tags, responsive_organizations } =
      this.props.selectedAction;
    const allAccounts = getAllGroupAccounts(this.props.selectedWorkingGroup);
    getAllTags().then((allTags) => {
      const externalTags = indexBy(
        responsive_tags.filter(({ title }) => !allTags[title]),
        "title"
      );
      const externalAccounts = indexBy(
        responsive_accounts.filter(({ id }) => !allAccounts[id]),
        "id"
      );
      this.setState({
        allTags: {
          ...externalTags,
          ...allTags,
        },
        allAccounts: {
          ...externalAccounts,
          ...allAccounts,
        },
      });
    });
  };

  onPillarChange = (pillar_number) => {
    console.log("pillar_number", pillar_number);
    this.setState(
      {
        pillar_number,
        category: undefined,
        sub_category: undefined,
        categoriesList: [],
        subCategoriesList: [],
        errors: dissoc(
          dissoc(dissoc(this.state.errors, "pillar_number"), "category"),
          "sub_category"
        ),
      },
      () => this.loadCategories(pillar_number)
    );
  };

  onCategoryChange = (category) => {
    this.setState(
      {
        category,
        sub_category: undefined,
        subCategoriesList: getSubcategoriesByCategory(
          this.props.indicatorGroup.title,
          category
        ),
        errors: dissoc(this.state.errors, "sub_category"),
      },
      () => this.loadSubCategories(category)
    );
  };

  loadCategories = (pillar) => {
    if (!pillar) return;

    const topicName = this.props.indicatorGroup.title;
    const list = getCategoriesByPillar(topicName, pillar);
    this.setState({ categoriesList: list || [] });
  };

  loadSubCategories = async (category) => {
    if (!category) return;
    const topicName = this.props.indicatorGroup.title;
    const list = getSubcategoriesByCategory(topicName, category);
    this.setState({ subCategoriesList: list || [] });
  };

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, errors: dissoc(this.state.errors, name) });
  };

  handleActionNameChange = (value) => {
    this.setState((prev) => ({
      ...prev,
      name: value,
    }));
  };

  handleActionNameClear = () => {
    this.setState((prev) => ({
      ...prev,
      name: "",
      pillar_number: undefined,
      category: undefined,
      sub_category: undefined,
      categoriesList: [],
      subCategoriesList: [],
      isActionNameSelected: false,
    }));
  };

  onSelectActionName = ({ pillar_number, category, sub_category }) => {
    const topicName = this.props.indicatorGroup.title;
    const categoriesList = getCategoriesByPillar(topicName, pillar_number);
    const subCategoriesList = category
      ? getSubcategoriesByCategory(topicName, category)
      : [];

    this.setState((prev) => ({
      ...prev,
      pillar_number,
      category,
      sub_category,
      categoriesList,
      subCategoriesList,
      isActionNameSelected: true,
    }));
  };

  handleRemoveTag = (tag) => {
    const removedTag = this.state.responsive_tags.filter((i) => i !== tag);
    this.setState({ responsive_tags: removedTag });
  };

  render() {
    throw "Function not implemented";
  }
}

class ActionPlanForm extends ActionPlanBase {
  state = initialState;

  submitAction = async (e) => {
    e.preventDefault();
    const { t } = this.props;
    this.setState({ alerts: [], errors: {} });
    const {
      end_at,
      name,
      description,
      number,
      start_at,
      responsive_account_ids,
      responsive_tags,
      allAccounts,
      attachments,
      pillar_number,
      category,
      sub_category,
    } = this.state;

    const sortedTags = responsive_account_ids.reduce(
      (acc, i) => {
        if (!allAccounts[i]) {
          acc.responsive_tags.push(i);
        } else {
          acc.responsive_account_ids.push(i);
        }
        return acc;
      },
      { responsive_tags: [], responsive_account_ids: [] }
    );

    const allResponsiveTags = [
      ...new Set(sortedTags.responsive_tags.concat(responsive_tags)),
    ];

    const action = {
      start_at: moment(start_at).startOf("day").toISOString(),
      end_at: moment(end_at).endOf("day").toISOString(),
      group_id: this.props.selectedWorkingGroup.id,
      name,
      description: description || null,
      number,
      responsive_account_ids: sortedTags.responsive_account_ids.length
        ? sortedTags.responsive_account_ids
        : null,
      responsive_tags: allResponsiveTags.length ? allResponsiveTags : null,
      pillar_number,
      category,
      sub_category,
    };

    const isUserAddedWorkingGroup = Boolean(
      this.props.indicatorGroup.removable
    );
    const hasRequiredFields =
      start_at && end_at && name && responsive_account_ids?.length > 0;
    const hasPillarFields = !isUserAddedWorkingGroup
      ? pillar_number && category && sub_category
      : true;

    if (hasRequiredFields && hasPillarFields) {
      const formData = new FormData();
      const request = {
        query: CREATE_ACTION,
        variables: {
          action,
          attachments: attachments.length
            ? Array(attachments.length).fill(null)
            : null,
        },
      };

      const map = {};
      Array(attachments.length)
        .fill("")
        .forEach((item, index) => {
          map[index] = [`variables.attachments.${index}`];
        });

      formData.append("operations", JSON.stringify(request));
      formData.append("map", JSON.stringify(map));

      Array(attachments.length)
        .fill("")
        .forEach((item, index) => {
          formData.append([index], attachments[index]);
        });

      try {
        const res = await Axios.post("/graphql", formData);

        if (res?.data.data) {
          toast.success(t("The action has been created successfully"));
          this.setState(initialState);
          this.props.fetchCurrentWorkingGroup();
          this.props.modalHandler();
        }
      } catch (err) {
        if (err.message.includes("422")) {
          const { alerts, errors } = parseErrors(
            errorsConfig,
            err.response.data.errors[0].extensions?.validation?.action
          );
          this.setState({ alerts, errors });
        }
      }
    } else {
      let errors = {};
      const requiredFields = [
        "start_at",
        "end_at",
        "name",
        "responsive_account_ids",
      ];

      // Only validate pillar-related fields if it's not a user-added working group
      if (!Boolean(this.props.indicatorGroup.removable)) {
        requiredFields.push("pillar_number", "category", "sub_category");
      }

      requiredFields.forEach((item) => {
        if (!this.state[item]) {
          errors = { ...errors, [item]: [t("Required field")] };
        }
      });

      this.setState({
        alerts: [t("Fill all required fields")],
        errors,
      });
    }
  };

  fileSelection = () => {
    const data = [];
    for (let i = 0; i < this.fileRef.files.length; i++) {
      data.push(this.fileRef.files[i].name);
    }
    this.setState({ attachments: data });
  };

  handleSelectChange = (field, value) => {
    this.setState({ 
      [field]: value,
      errors: dissoc(this.state.errors, field)
    });
  };

  handleMultiSelectChange = (value) => {
    this.setState({ 
      responsive_account_ids: value,
      errors: dissoc(this.state.errors, 'responsive_account_ids')
    });
  };

  removeResponsible = (id) => {
    this.setState(prev => ({
      responsive_account_ids: prev.responsive_account_ids.filter(item => item !== id)
    }));
  };

  render() {
    const { t, indicatorGroup } = this.props;
    const workingGroupTitle = indicatorGroup.title;
    const isUserAddedWorkingGroup = Boolean(indicatorGroup.removable);

    const {
      name,
      description,
      start_at,
      end_at,
      responsive_account_ids,
      allAccounts,
      alerts,
      errors,
      responsive_tags,
      allTags,
      attachments = [],
      pillar_number,
      category,
      sub_category,
      categoriesList = [],
      subCategoriesList = [],
      isActionNameSelected,
    } = this.state;

    const allPeople = { ...allAccounts, ...allTags };

    return (
      <Modal
        title={t("Create a new action")}
        open={this.props.visible}
        onCancel={this.props.modalHandler}
        footer={
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            padding: '16px 0 0'
          }}>
            <ShButton
              variant="outline"
              size="lg"
              onClick={this.props.modalHandler}
            >
              {t("Cancel")}
            </ShButton>
            <ShButton 
              size="lg"
              onClick={this.submitAction}
            >
              {t("Create action")}
            </ShButton>
          </div>
        }
        zIndex={9999}
        width="900px"
      >
        <form id="header" onSubmit={this.submitAction} ref={this.parentRef} onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}>
          <div style={{ padding: '24px 32px', display: 'grid', gap: '24px' }}>
            <ErrorAlerts alerts={alerts} />
            
            {/* Action Name */}
            <FormGroup>
              <Label>{t("Action name")} <span style={{ color: 'hsl(var(--destructive))' }}>*</span></Label>
              <ActionNameSelection
                onChange={this.handleActionNameChange}
                onSelect={this.onSelectActionName}
                value={name}
                topicName={workingGroupTitle}
                placeholder={t("Enter action name")}
                onClear={this.handleActionNameClear}
                existingActions={this.props.actions.map(
                  (action) => action.name
                )}
              />
              <InputErrors name={"name"} errors={errors} />
            </FormGroup>
            
            {/* Classification Fields */}
            {!isUserAddedWorkingGroup && (
              <>
                <Separator />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <FormGroup>
                    <Label>{t("Pillar")} <span style={{ color: 'hsl(var(--destructive))' }}>*</span></Label>
                    <Select
                      value={pillar_number}
                      onChange={this.onPillarChange}
                      disabled={isActionNameSelected}
                      placeholder={t("Select")}
                      options={[
                        { value: 'I', label: 'Pillar I' },
                        { value: 'II', label: 'Pillar II' },
                        { value: 'III', label: 'Pillar III' },
                      ]}
                      error={!!errors.pillar_number}
                    />
                    <InputErrors name={"pillar_number"} errors={errors} />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>{t("Category")} <span style={{ color: 'hsl(var(--destructive))' }}>*</span></Label>
                    <Select
                      value={category}
                      onChange={this.onCategoryChange}
                      disabled={!pillar_number || isActionNameSelected}
                      placeholder={t("Select")}
                      options={categoriesList.map(item => ({
                        value: item.value,
                        label: item.value
                      }))}
                      error={!!errors.category}
                    />
                    <InputErrors name={"category"} errors={errors} />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>{t("Sub-category")} <span style={{ color: 'hsl(var(--destructive))' }}>*</span></Label>
                    <Select
                      value={sub_category}
                      onChange={(val) => this.handleSelectChange('sub_category', val)}
                      disabled={!category || isActionNameSelected}
                      placeholder={t("Select")}
                      options={subCategoriesList.map(item => ({
                        value: item.value,
                        label: item.value
                      }))}
                      error={!!errors.sub_category}
                    />
                    <InputErrors name={"sub_category"} errors={errors} />
                  </FormGroup>
                </div>
              </>
            )}
            
            <Separator />
            
            {/* Date Range */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormGroup>
                <Label>{t("Start date")} <span style={{ color: 'hsl(var(--destructive))' }}>*</span></Label>
                <DatePicker
                  value={start_at}
                  onChange={(val) => this.setState({
                    start_at: val ? val.startOf("day") : moment().startOf("day"),
                    errors: dissoc(this.state.errors, 'start_at')
                  })}
                  placeholder={t("Select date")}
                  disabled={false}
                  min={moment().format('YYYY-MM-DD')}
                  style={errors.start_at ? { borderColor: 'hsl(var(--destructive))' } : {}}
                />
                <InputErrors name={"start_at"} errors={errors} />
              </FormGroup>
              
              <FormGroup>
                <Label>{t("End date")} <span style={{ color: 'hsl(var(--destructive))' }}>*</span></Label>
                <DatePicker
                  value={end_at}
                  onChange={(val) => this.setState({
                    end_at: val ? val.endOf("day") : moment().endOf("day"),
                    errors: dissoc(this.state.errors, 'end_at')
                  })}
                  placeholder={t("Select date")}
                  disabled={false}
                  min={start_at ? moment(start_at).add(1, 'day').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
                  style={errors.end_at ? { borderColor: 'hsl(var(--destructive))' } : {}}
                />
                <InputErrors name={"end_at"} errors={errors} />
              </FormGroup>
            </div>
            
            <Separator />
            
            {/* Assign To */}
            <FormGroup>
              <Label>{t("Assign to")} <span style={{ color: 'hsl(var(--destructive))' }}>*</span></Label>
              <Select
                value={responsive_account_ids}
                onChange={this.handleMultiSelectChange}
                placeholder={t("Select people or add tags")}
                options={Object.values(allPeople).map(acc => ({
                  value: acc.id,
                  label: `${acc.isTag ? '#' : ''}${acc.first_name || ''} ${acc.last_name || ''}`
                }))}
                multiple
                showSearch
                error={!!errors.responsive_account_ids}
              />
              
              {responsive_account_ids.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {responsive_account_ids.map(id => {
                    const person = allPeople[id];
                    if (!person) return null;
                    const isTag = responsive_tags.includes(id);
                    return (
                      <Badge 
                        key={id}
                        variant={isTag ? "default" : "secondary"}
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          padding: '6px 10px',
                          fontSize: '13px'
                        }}
                      >
                        {person.isTag ? '#' : ''}{person.first_name} {person.last_name}
                        <X 
                          size={14} 
                          style={{ cursor: 'pointer' }}
                          onClick={() => this.removeResponsible(id)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
              <InputErrors name={"responsive_account_ids"} errors={errors} />
            </FormGroup>

            <Separator />
            
            {/* Description */}
            <FormGroup>
              <Label>{t("Description")}</Label>
              <Editor
                height={150}
                value={description}
                onChange={(val) =>
                  this.setState({
                    description: val,
                    errors: dissoc(this.state.errors, "description"),
                  })
                }
                className={`${errors.description && "input-error"}`}
              />
              <InputErrors name={"description"} errors={errors} />
            </FormGroup>
            
            {/* Attachments */}
            <FormGroup>
              <Label>{t("Attachments")}</Label>
              <FileUpload
                attachments={[]}
                setAttachments={(attachments) =>
                  this.setState({ attachments })
                }
              />
            </FormGroup>
          </div>
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedWorkingGroup: state.selectedWorkingGroup,
  actions: state.actions.data,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchActionPlans }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withLocale(ActionPlanForm)));
