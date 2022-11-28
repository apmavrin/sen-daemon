require("dotenv").config();
const axios = require("axios");
const main = require("../index");

async function senOktaPrep(senUsers) {
  console.log("Okta IdP was selected");

  process.stdout.write(`Processing user 0 of ${senUsers.length}`);

  //Obtain list of users from Okta
  for (user in senUsers) {
    process.stdout.cursorTo(16);
    process.stdout.write(`${+user + 1} of ${senUsers.length}`);

    try {
      let requestUri =
        process.env.OKTA_URL + "/api/v1/users/" + senUsers[user].email;
      let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "SSWS " + process.env.OKTA_KEY,
      };

      let oktaUser = await axios.get(requestUri, {
        headers: headers,
      });

      if (oktaUser.data.status !== 'ACTIVE') {
        main.inactiveUsers.push(senUsers[user]);
      }
    } catch (err) {
      //console.log(err.response.data.errorSummary);
    }
  }

  console.log(`\n${main.inactiveUsers.length} inactive user(s) found.`);
}

module.exports = {
  senOktaPrep: senOktaPrep,
};
