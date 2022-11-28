<h3>SAP Enable Now - MS Azure AD and Okta sync</h3>

The script does the following:
<ol>
<li>Connects to your SAP Enable Now Manager using the service account with the basic authentication (username/password)</li>
<li>Loads the information about the ACTIVE SSO accounts in the SAP Enable Now Manager</li>
<li>Checks the status of every active account in Manager against MS Azure AD or Okta</li>
<li>Marks inactive accounts in the list obtained from the SAP Enable Now Manager after comparing with MS Azure AD or Okta</li>
<li>Deactivates (not deletes!) the SAP Enable Now SSO account that is no longer active in your identity provider</li>
<li>Executes steps 1-5 according to the assigned schedule: (i.e., daily).</li>
<li>The information about deactivated SAP Enable Now accounts is now saved in the log file /logs/senSync.log</li>
</ol>
<p>
Requirements:
  <ol>  
<li>Virtual/physical machine with Node.js and npm installed that will be used for running the script</li>
<li>Administrative access to the MS Azure AD or Okta</li>
<li>MS Visual Studio Code or another IDE</li>
  </ol>
  
  <p> Implementation guide please find on the <a href="https://blogs.sap.com/2022/11/08/keeping-sap-enable-now-sso-accounts-synced-with-azure-ad/" target="_blank">SAP Enable Now Community</a>.
