import React, { Component } from "preact-compat";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cn from "classname";

import Client from "./client";
import { fetchProductsMatching } from "./store";

@connect((state) => {
  const search = state.searches[state.query] || { status: "loading", result: [] };
  console.log("state:", search);
  return {
    query: state.query,
    status: search.status,
    products: search.result,
  };
})

export default class Empty extends Component {
  propTypes = {
    client: PropTypes.instanceOf(Client).isRequired,
    onSelect: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
    products: PropTypes.array,
  }

  componentDidMount() {
    this.performSearch();
  }

  performSearch(query) {
    const { client, dispatch } = this.props;
    dispatch(fetchProductsMatching(query, client));
  }

  handleSubmit(e) {
    e.preventDefault();
    this.performSearch(this.el.value);
  }

  handleSelect(product, e) {
    const { onSelect } = this.props;
    e.preventDefault();
    console.log("onselect:", product);
    onSelect(product);
  }

  renderResult(product) {
    return (
      <button
        className="empty__product"
        type="button"
        key={product.key}
        onClick={this.handleSelect.bind(this, product)}
      >
        <div
          className="empty__product__image"
          style={{ backgroundImage: `url(${product.imageUrl})` }}
        />
        <div className="empty__product__title">
          {product.masterData.current.name}
        </div>
      </button>
    );
  }

  render() {
    const { products, status } = this.props;

    return (
      <div className="empty">
        <div className="empty__label">
          No product selected
        </div>
        <form className="empty__search" onSubmit={this.handleSubmit.bind(this)}>
          <div className="empty__search__input">
            <input
              placeholder="Search products... (e.g. mens shirts, sku, description)"
              type="text"
              ref={(el) => { this.el = el; }}
            />
          </div>
          <button
            className={cn("DatoCMS-button--primary", { loading: status === "loading" })}
            type="submit"
          >
            Search
            <span className="spinner" />
          </button>
        </form>
        {
          products
          && (
            <div className={cn("empty__products", { loading: status === "loading" })}>
              {products.map(this.renderResult, this)}
            </div>
          )
        }
      </div>
    );
  }
}
