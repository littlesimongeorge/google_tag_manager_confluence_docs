function init() {
  
  /* config object used for API calls
  gtmAccountId and gtmContainerId can be retrieved from an API call or within GTM by navigating to "versions" and observing the url: https://tagmanager.google.com/#/versions/accounts/[accountId]/containers/[containerId]/versions
  gaAccountId and gaMeasurementId can be retrieved from your GA Admin settings
  confluence API tokem will need to be retrieved from your JIRA admins
  For confluencePageId, create your page in confluence first. Once published click on the menu (...) in the top right then select "Page History". The page Id will be present in the url
  confluencePageName is the page title, no need to escape spaces, just use the name as is
  confluenceDomain should be this part https://[domain]/wiki/...
  */
  
  const config = {
    'gtmAccountId' : '',
    'gtmContainerId': '',
    'gaAccountId': '',
    'gaMeasurementId': '',
    'confluenceAPIToken' : '',
    'confluencePageId': '',
    'confluencePageName': '',
    'confluenceDomain': ''
  }
  callGoogleAPIs(config);
}
