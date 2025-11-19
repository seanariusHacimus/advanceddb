import React from 'react';
import { Spin } from 'antd'; // Using Ant Spin for global spinner
import { useLocale } from "../../utils/locale";

export default function Spinner(props) {
  const [t] = useLocale()
  return (
    <div id="spinner-container" style={props.style}>
      <Spin tip={t("Loading...")} />
    </div>
  )
}
