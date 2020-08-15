import React, { Component } from "react";
import PropTypes from "prop-types";

import connectToDatoCms from "./connectToDatoCms";
import "./style.sass";

@connectToDatoCms(plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath),
}))
export default class Main extends Component {
  static propTypes = {
    fieldValue: PropTypes.bool.isRequired,
  };

  render() {
    const { fieldValue } = this.props;
    console.log("Field Value here!!!!!!!!!!>>>>>>>", fieldValue);
    return <div className="container">Naren was here!!!</div>;
  }
}
