#!/usr/bin/env node

// read in env settings
require("dotenv").config();
var schedule = require("node-schedule");
var yargs = require("yargs");

const options = yargs
.usage("Usage: --sync <Identity provider name>")
.option('sync', {description: `Use 'azure' for MS Azure AD and 'okta' for Okta IdP`, demandOption: true})
.argv;

let inactiveUsers = [];
const sen = require("./sen");
const azure = require("./providers/azure");
const okta = require("./providers/okta");
const logger = require("./logger/logger");

async function main() {
  const senSync = await sen.getSENSession(
    process.env.SEN_URL,
    process.env.SEN_USER,
    process.env.SEN_PWD
  );

  let senUsers = senSync.filter((element) => {
    return element.email.trim() !== "";
  });

  switch (yargs.argv['sync']) {
    case "azure":
      await azure.senAzurePrep(senUsers);
      break;
    case "okta":
      await okta.senOktaPrep(senUsers);
      break;
    default:
      throw "Identity provider is not selected";
  }

  if (inactiveUsers.length > 0) {
    console.log(`Deactivating ${inactiveUsers.length} user(s)...`);
    await sen.deactivateUsers(process.env.SEN_URL, inactiveUsers);
  } else {
    console.log('SAP Enable Now accounts status is actual.')
  }

  logger.writeLog(inactiveUsers);

}

main();

// const job = schedule.scheduleJob({ hour: 19, minute: 40 }, () => {
//   main();
// });

exports.inactiveUsers = inactiveUsers;