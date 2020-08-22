import React, { Component, render } from "preact-compat";
import { Provider } from "react-redux";

import Empty from "./Empty.jsx";
import Value from "./Value.jsx";
import store from "./store";
import Client from "./client";

import "./style/index.sass";

const stateFromPlugin = plugin => ({
  value: plugin.getFieldValue(plugin.fieldPath),
  developmentMode: plugin.parameters.global.developmentMode,
  clientId: plugin.parameters.global.clientId,
  clientSecret: plugin.parameters.global.clientSecret,
  projectKey: plugin.parameters.global.projectKey,
});

const replacementFieldRegex = /\$[a-zA-Z_]+/g;

window.DatoCmsPlugin.init().then((plugin) => {
  plugin.startAutoResizer();

  class Input extends Component {
    constructor(props) {
      super(props);

      this.state = stateFromPlugin(plugin);
      this.client = new Client(this.state);
    }

    componentDidMount() {
      const matches = this.getPathReplacementFields();
      console.log(matches);
      this.unsubscribe = plugin.addFieldChangeListener(plugin.fieldPath, () => {
        const newState = stateFromPlugin(plugin);
        this.setState(newState);
        this.client = new Client(newState);
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    getPathReplacementFields() {
      // eslint-disable-next-line react/destructuring-assignment
      const entity = "$slug";
      // eslint-disable-next-line
      const matches = entity.match(replacementFieldRegex);
      // eslint-disable-next-line
      return matches && matches.map(m => m.replace('$', ''));
    }

    handleSelect = (product) => {
      if (product.masterData.current) {
        plugin.setFieldValue("slug", product.masterData.current.slug);
        plugin.setFieldValue("title", product.masterData.current.name);
        plugin.setFieldValue("sku", product.masterData.current.sku);
      }
      console.log(plugin.fieldPath);
      plugin.setFieldValue(plugin.fieldPath, product.key);
    }

    handleReset = () => {
      plugin.setFieldValue(plugin.fieldPath, null);
    }

    render() {
      const { value } = this.state;

      return value
        ? <Value client={this.client} value={value} onReset={this.handleReset} />
        : <Empty client={this.client} onSelect={this.handleSelect} />;
    }
  }

  render(
    <Provider store={store}>
      <Input />
    </Provider>,
    document.body,
  );
});
