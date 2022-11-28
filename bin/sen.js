const { StubbedNetworkModule } = require("@azure/msal-common");
const axios = require("axios");
let jSessionId = "";

async function getSENSession(senUrl, userName, password) {
  let getSessionUri = senUrl + "login";
  let response = await axios.post(getSessionUri, {
    auth_user: userName,
    password: password,
  });

  jSessionId = response.headers.get("set-cookie")[0].split(";")[0].slice(11);
  console.log('Successfully authenticated in the SAP Enable Now Manager');

  let getUsersUri = senUrl + "!/user";

  let usersList = await axios.get(getUsersUri, {
    headers: {
      Cookie: `JSESSIONID=${jSessionId}`,
    },
  });

  let senUsers = [];
  for (let user of usersList.data.response.user) {
    if (user.active === true && user.imported_user_type === "saml") {
      senUsers.push({
        uid: user.uid,
        email: user.email,
      });
    }
  }
  return senUsers;
}

async function deactivateUsers(senUrl, senUsers) {
  for (let user of senUsers) {
    try {
      let requestUri = `${senUrl}!/user/${user.uid}`;
      const data = {
        user: {
          active: false,
        },
      };

      const deactivate = await axios.post(requestUri, data, {
        headers: {
          Cookie: `JSESSIONID=${jSessionId}`,
        },
      });

      user.date = new Date().toUTCString();
      
    } catch (e) {
      console(e);
    }
  }
  console.log("User(s) successfully deactivated");
}

module.exports = {
  getSENSession: getSENSession,
  deactivateUsers: deactivateUsers,
};
