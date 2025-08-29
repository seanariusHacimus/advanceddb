import React from 'react';
import { useLocale } from "../../utils/locale";

export default function Spinner(props) {
  const [t] = useLocale();
  return (
    <div style={props.style}>
      {t("Loading...")}
    </div>
  )
}
