import React, { forwardRef } from "react";
import ReactToPrint from "react-to-print";
import { Button } from "../../styles";
import iconPrinter from "../../assets/simulation/printer.svg";
import { useLocale } from "../../utils/locale";
import { ButtonAlternative } from "../../styles/buttons";

export default forwardRef((props, ref) => {
  const [t] = useLocale();
  const {
    beforePrint = () => console.log("Before Print"),
    afterPrint = () => console.log("After Print"),
    orientation = "landscape",
  } = props;

  return (
    <div className="printer-container" style={props.style}>
      <ReactToPrint
        onBeforePrint={() => console.log("before function")}
        onAfterPrint={afterPrint}
        onBeforeGetContent={async () => await beforePrint()}
        removeAfterPrint={true}
        pageStyle={`@page { size: A4 ${orientation} !important;}`}
        trigger={() => (
          <ButtonAlternative size="small">
            <img src={iconPrinter} alt="added btn" /> {t("Print")}
          </ButtonAlternative>
        )}
        content={() => ref}
      />
    </div>
  );
});
