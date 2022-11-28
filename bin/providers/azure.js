const auth = require("../auth");
const fetch = require("../fetch");
const main = require("../index");

async function senAzurePrep(senUsers) {
  console.log("MS Azure AD was selected");

  // here we get an access token
  const authResponse = await auth.getToken(auth.tokenRequest);

  process.stdout.write(`Processing user 0 of ${senUsers.length}`)

  for (let user in senUsers) {

    process.stdout.cursorTo(16);
    process.stdout.write(`${+user + 1} of ${senUsers.length}`);

    try {
      //add the SEN params to the API call
      auth.apiConfig.uri =
        process.env.GRAPH_ENDPOINT +
        `/v1.0/users?$filter=mail eq '${senUsers[user].email}'&$select=DisplayName,accountEnabled`;

      // call the web API with the access token
      const users = await fetch.callApi(
        auth.apiConfig.uri,
        authResponse.accessToken
      );

      if (!users.value[0].accountEnabled) {
        main.inactiveUsers.push(senUsers[user]);
      }

    } catch (error) {

    }
  }

  console.log(`\n${main.inactiveUsers.length} inactive user(s) found.`);
}

module.exports = {
  senAzurePrep: senAzurePrep,
};
