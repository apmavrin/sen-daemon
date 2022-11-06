#!/usr/bin/env node

// read in env settings
require("dotenv").config();
var schedule = require("node-schedule");

let inactiveUsers = [];
const fetch = require("./fetch");
const auth = require("./auth");
const sen = require("./sen");

async function main() {
  const senSync = await sen.getSENSession(
    process.env.SEN_URL,
    process.env.SEN_USER,
    process.env.SEN_PWD
  );

  // here we get an access token
  const authResponse = await auth.getToken(auth.tokenRequest);

  let senUsers = senSync.filter((element) => {
    return element.email.trim() !== "";
  });

  for (let user in senUsers) {
    console.clear();
    console.log(`Processing user ${+user + 1} of ${senUsers.length}`);
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
        console.log("Inactive account found");
        inactiveUsers.push(senUsers[user]);
      }
    } catch (error) {
      console.log("User doesn't exist in Azure AD");
    }
  }

  if (inactiveUsers.length > 0) {
    console.log(`Deactivating ${inactiveUsers.length} user(s)...`);
  }

  await sen.deactivateUsers(process.env.SEN_URL, inactiveUsers);
}

const job = schedule.scheduleJob({ hour: 23, minute: 21 }, () => {
  main();
});
