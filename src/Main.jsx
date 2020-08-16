/* eslint-disable */
import { createClient } from "@commercetools/sdk-client";
import { createAuthMiddlewareForClientCredentialsFlow } from "@commercetools/sdk-middleware-auth";
import {
  createRequestBuilder,
  features,
} from "@commercetools/api-request-builder";
import { createHttpMiddleware } from "@commercetools/sdk-middleware-http";
import PropTypes from "prop-types";
import React, { Component } from "react";
import connectToDatoCms from "./connectToDatoCms";
import "./style.sass";

@connectToDatoCms((plugin) => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath),
  clientId: plugin.parameters.global.clientId,
  clientSecret: plugin.parameters.global.clientSecret,
  projectKey: plugin.parameters.global.projectKey,
}))
export default class Main extends Component {
  static propTypes = {
    fieldValue: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    clientSecret: PropTypes.string.isRequired,
    projectKey: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "a",
      results: [],
    };
    this.ctpClient = createClient({
      // The order of the middlewares is important !!!
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow({
          host: "https://auth.europe-west1.gcp.commercetools.com",
          projectKey: props.projectKey,
          scopes: [
            "view_products:" + props.projectKey,
            "view_categories:" + props.projectKey,
          ],
          credentials: {
            clientId: props.clientId,
            clientSecret: props.clientSecret,
          },
          fetch,
        }),
        createHttpMiddleware({
          host: "https://api.europe-west1.gcp.commercetools.com",
          fetch,
        }),
      ],
    });
    this.requestBuilder = createRequestBuilder({
      projectKey: props.projectKey,
      customServices: {
        graphql: {
          type: "graphql",
          endpoint: "/graphql",
          features: [features.query],
        },
      },
    });
    this.searchCT();
  }

  searchCT() {
    let productQuery = this.requestBuilder.productProjectionsSearch;
    productQuery.text(this.state.searchTerm, "EN-GB");
    productQuery.perPage(5);
    let productRequest = {
      uri: productQuery.build(),
      method: "GET",
    };
    this.doRequest(productRequest).then((response) => {
      if (response.body && response.body.results) {
        console.log("response.body.results:::::>>>", response.body.results);
        this.setState({
          ...this.state,
          results: response.body.results,
        });
      }
    });
  }

  componentDidMount() {
    this.searchCT();
  }

  doRequest(request) {
    let self = this;
    try {
      if (self.ctpClient && request) {
        return self.ctpClient
          .execute(request)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            throw error;
          });
      } else {
        throw "Client not initialized";
      }
    } catch (e) {
      if (self.rejectFn) {
        self.rejectFn(e);
      } else {
        throw e;
      }
    }
  }

  handleChange(e) {
    this.setState({
      ...this.state,
      searchTerm: e.target.value,
    });
    this.searchCT();
  }

  render() {
    const { fieldValue } = this.props;
    console.log("Field Value here!!!!!!!!!!>>>>>>>", fieldValue);
    return (
      <div className="container">
        <div>
          <label htmlFor="searchInput">Search:</label>
          <input
            type="text"
            name="searchInput"
            onChange={this.handleChange.bind(this)}
          />
        </div>
        {JSON.stringify(this.state.results.map((item) => item.key))}
      </div>
    );
  }
}
