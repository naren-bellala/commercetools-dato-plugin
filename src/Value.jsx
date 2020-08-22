import React, { Component } from "preact-compat";
import PropTypes from "prop-types";
import cn from "classname";
import { connect } from "react-redux";

@connect((state) => {
  const product = state.products[0];
  console.log("Value: ", state.products);
  return {
    product: product && product.result,
  };
})
export default class Value extends Component {
  propTypes = {
    value: PropTypes.string.isRequired,
    product: PropTypes.object,
    onReset: PropTypes.func.isRequired,
  }

  render() {
    const { onReset, product, value } = this.props;
    console.log(product);
    return (
      <div className={cn("value")}>
        {
          product
          && value
        }
        <button type="button" className="value__reset" onClick={onReset} />
      </div>
    );
  }
}
