import React from "react";
import PropTypes from "prop-types";

// Character Counter Component
const CharacterCounter = ({ maxChars, currentLength, customText, t }) => {
  if (maxChars) {
    return (
      <div>
        {t("Maximum character size: ")}
        {`${maxChars - (currentLength || 0)}/${maxChars}`}
      </div>
    );
  }
  return <p>{customText || ""}</p>;
};

// PropTypes
CharacterCounter.propTypes = {
  maxChars: PropTypes.number,
  currentLength: PropTypes.number,
  customText: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default CharacterCounter;
