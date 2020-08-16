import createClient from "@commercetools/sdk-client";
import createAuthMiddlewareForClientCredentialsFlow from "@commercetools/sdk-middleware-auth";
import createHttpMiddleware from "@commercetools/sdk-middleware-http";
import {
  CreateRequestBuilder,
  features,
} from "@commercetools/api-request-builder";

export default class CommerceToolsClient {
  constructor({ projectKey, clientId, clientSecret }) {
    this.projectKey = projectKey;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  getClient() {
    return createClient({
      // The order of the middlewares is important !!!
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow({
          host: "https://auth.europe-west1.gcp.commercetools.com",
          projectKey: this.projectKey,
          scopes: [
            `view_products:${this.projectKey}`,
            `view_categories:${this.projectKey}`,
          ],
          credentials: {
            clientId: this.clientId,
            clientSecret: this.clientSecret,
          },
          fetch,
        }),
        createHttpMiddleware({
          host: "https://api.europe-west1.gcp.commercetools.com",
          fetch,
        }),
      ],
    });
  }

  getRequestBuilder() {
    return new CreateRequestBuilder({
      projectKey: this.projectKey,
      customServices: {
        graphql: {
          type: "graphql",
          endpoint: "/graphql",
          features: [features.query],
        },
      },
    });
  }
}
