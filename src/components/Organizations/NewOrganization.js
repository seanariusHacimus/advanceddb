import React, { useState, useCallback, createRef } from 'react';
import {
  Modal, Alert,
} from 'antd';
import { WorkingGroup } from '../../styles/workingGroup';
import {
  Input, InputWrapper, Flex, Button, ButtonPrimary,
} from '../../styles';
import { createOrganization } from '../../graphql/organizations';
import {useLocale} from "../../utils/locale";

export default function NewOrganization(props) {
  const [t] = useLocale()
  const [title, setTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const titleRef = createRef();

  const newOrganization = useCallback(async () => {
    const data = await createOrganization(title);

    if (data.data.create_organization) {
      props.fetchOrganizations();
      props.modalHandler();
      setTitle('');
    } else {
      const msg = data.data.errors[0].extensions.validation.title;
      setErrorMsg(msg)
    }
  }, [title]);

  return (
    <WorkingGroup>
      <Modal
        title={null}
        visible={props.visible}
        onOk={props.modalHandler}
        onCancel={props.modalHandler}
        footer={null}
        zIndex={1080}
      >
        <h2 style={styles.title}>{t("Create an organization")}</h2>
        {errorMsg && <Alert style={{ textTransform: 'capitalize' }} message={errorMsg} type="error" showIcon />}
        <InputWrapper className="has-messages">
          <Input
            required
            type="text"
            name="title"
            ref={titleRef}
            value={title}
            autoComplete="new-email"
            id="WG-title"
            className={`dynamic-input ${title ? 'has-value' : ''}`}
            onChange={e => setTitle(e.target.value)}
          />
          <label htmlFor="" onClick={() => titleRef.focus()}>{t("Organization title")}</label>
        </InputWrapper>


        <Flex>
          <Button type="reset" onClick={props.modalHandler}
            style={{ height: 51, marginRight: 12 }}>{t("Cancel")}</Button>
          <ButtonPrimary onClick={newOrganization}>{t("Apply")}</ButtonPrimary>
        </Flex>
      </Modal>
    </WorkingGroup>
  );
}

const styles = {
  title: {
    fontSize: 24,
    fontWeight: 400,
    lineHeight: '30px',
    color: '#252A32',
  },
};
