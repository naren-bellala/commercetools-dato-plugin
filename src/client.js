// import gql from "graphql-tag";

// export const GET_PRODUCT = gql`
//   query getProduct($id: ID!) {
//     product(id: $id) {
//       id
//       title
//       description
//       image
//       price
//     }
//   }
// `;
export default class CommerceToolsClient {
  constructor({ projectKey, clientId, clientSecret }) {
    this.projectKey = projectKey;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.access_token = "";
  }

  getAccessToken() {
    const apiHeaders = new Headers();
    apiHeaders.append("Authorization", "Basic OWFGMU9Ca09IOGU0aGlRdkFWa0VvNUwzOlNDR0ZtMGEzczJ1RVM4TzVFdUF2cW12MVNVeUFoT0Qz");

    const requestOptions = {
      method: "POST",
      headers: apiHeaders,
      body: "",
      redirect: "follow",
    };

    return fetch("https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials", requestOptions)
      .then(response => response.json())
      .then(result => result.access_token)
      .catch(error => console.log("error", error));
  }

  productsMatching(query) {
    return this.fetch({
      query: `
          query getProducts($query: String) {
            product(sku: $query) {
              skus
              key
              masterData {
                current {
                  skus
                  name(locale: "EN-GB")
                  slug(locale: "EN-GB")
                  description(locale: "EN-GB")
                  categories {
                    name(locale: "EN-GB")
                  }
                }
              }
            }
          }
        `,
      variables: { query: query || null },
    }).then(result => {
      const arr = [];
      arr[0] = result.product;
      console.log("fetch results:", arr);
      return arr;
    });
  }

  fetch(body) {
    return this.getAccessToken()
      .then(token => fetch(
        `https://api.europe-west1.gcp.commercetools.com/${this.projectKey}/graphql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      ))
      .then(res => res.json())
      .then(res => res.data)
      .catch(error => console.log("error", error));
  }
}
