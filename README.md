# google_tag_manager_confluence_docs
A Google AppScript Solution to document GTM containers in Atlassin Confluence

## What you'll need
- Google Account - you'll need to test these scripts using the same account you use to access GA and GTM
- Atlassin Confluence API Token - you'll be able to get one from your Jira Admins

## Things you'll need to do before testing this script
- Add the Google Tagmanager and Google Analytics Management Services to your script project, you can view instructions on how to do so here: https://developers.google.com/apps-script/guides/services/advanced
- Create a Confluence page as you'll need a page title and page Id for the script to update.  The pageId can be retrieved after you've created and published the blank page.  Just click on the menu in the top right (...) then select "Page History".  The pageId is shown in the url.

## Instructions
- Create a Google AppScript project
- Add the Google Tagmanager and Google Analytics Management Services to your project
- Copy over the 3 .gs files from this repo
- Complete all the details within the config object found in the init.gs file
```
// init.js
function init() {
  const config = {
    'gtmAccountId' : '123456789',
    'gtmContainerId': '1234567',
    'gaAccountId': '12345678',
    'gaMeasurementId': 'UA-XXXXXXXX-X',
    'confluenceAPIToken' : 'nkdnslcpien842nfm-9fh42i-hr',
    'confluencePageId': '12345678',
    'confluencePageName': 'Your page title',
    'confluenceDomain': 'www.yourOrgDomain.com'
  }
  callGoogleAPIs(config);
}
```
- Finally click run from the init.gs file
- If all goes well your confluence page should update within a minute
- Once happy with the code you can schedule the script to run automatically, see Time-driven triggers here: https://developers.google.com/apps-script/guides/triggers/installable

## Things to consider and look out for
- This example project was set up under the assumption that a single container sends data to a single GA property
- Consider using account level GTM API calls and looping through each container to remove the manaual work of entering information in the config (same for GA)
- The Confluence API uses xHTML so ensure any special characters are replaced or escaped, you'll notice my code in the confluence.gs file replaces ampersand with "AND".
- An alternative to Confluence is sending the data to a google sheet instead which can then be iframed in to a Confluence page. (This was my original solution)

## Docs I used to put this all together
- Atlassin Confluence API: https://developer.atlassian.com/cloud/confluence/rest/api-group-content/
- Google Analytics Managment API v3: https://developers.google.com/analytics/devguides/config/mgmt/v3
- Google Tagmanager API v2: https://developers.google.com/tag-platform/tag-manager/api/v2/reference






