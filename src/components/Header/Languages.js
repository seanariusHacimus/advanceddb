import React, { useRef } from 'react';
import { StyledLanguages } from '../../styles/header';
import { useLocale } from "../../utils/locale";

const Languages = () => {
  const [t, code, setCode, codeList] = useLocale();
  const parentRef = useRef();
  return (
    <StyledLanguages ref={parentRef}>
      <select
        value={code}
        className="language-list"
        onChange={e => setCode(e.target.value)}
      >
        {codeList.map(code => (<option key={code} value={code}>{t(code)}</option>))}
      </select>
    </StyledLanguages>
  );
};

export default Languages;
