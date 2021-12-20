function uploadToConfluenceSDR(data) {


  // Title for confluence page

  var html = `<h1>Mapping of GTM container file ${data.container} v${data.version} as of ${new Date().toLocaleString()}</h1><br></br>`

  // confluence macro for page contents

  html += `<p>This document is updated automatically, any changes will be overwritten</p><br></br>
  <ac:structured-macro ac:macro-id="3d25c234-6da7-4d18-8bd1-163f3d15c184" ac:name="toc" ac:schema-version="1">
  <ac:parameter ac:name="minLevel">2</ac:parameter>
  </ac:structured-macro>
  <h2>Tags</h2>
  <br></br>
  <table><tr>
  <th>Folder</th><th>Name</th><th>Type</th><th>Triggers</th><th>Mapping</th><th>GA Dimension</th><th>GA Metrics</th></tr>`

  // seperate GA and non GA tags

  var gaTags = data.tags.filter(t => t[1] == 'ua')
  var nongaTags = data.tags.filter(t => t[1] != 'ua')

  // loop through GA tags and append to html string
  // ensure last 4 columns are wrapped in a confluence code block macro

  for (i = 0; i < gaTags.length; i++) {
    html += '<tr>'
    gaTags[i].forEach((c, i) => {

      if (c && i > 2) {
        //html += `<td><pre>${c.replace(/\&/g, ' AND ')}</pre></td>`
        html += `<td><ac:structured-macro ac:macro-id="ae7f83d8-d05d-4888-9614-19f9e3d70685" ac:name="code" ac:schema-version="1">
        <ac:parameter ac:name="language">js</ac:parameter>
        <ac:parameter ac:name="title">JSON</ac:parameter>
        <ac:parameter ac:name="collapse">true</ac:parameter>
        <ac:plain-text-body><![CDATA[${c}]]></ac:plain-text-body>
        </ac:structured-macro></td>`
      } else {
        html += `<td>${c.replace(/\&/g, ' AND ')}</td>`
      }
    })
    html += '</tr>'
  }

  html += `</table>
 <br></br>
 <h2>Other Tags</h2>
 <br></br>
 <table><tr>
 <th>Folder</th><th>Name</th><th>Type</th><th>Triggers</th><th>Mapping</th><th>GA Dimension</th><th>GA Metrics</th></tr>`

  
  // loop through non GA tags and append to html string
  // ensure last 4 columns are wrapped in a confluence code block macro
  
  for (i = 1; i < nongaTags.length; i++) {
    html += '<tr>'
    //html += `<td><pre>${c.replace(/\&/g, ' AND ')}</pre></td>`
    nongaTags[i].forEach((c, i) => {

      if (c && i > 2) {
        //html += `<td><pre>${c.replace(/\&/g, ' AND ')}</pre></td>`
        html += `<td><ac:structured-macro ac:macro-id="ae7f83d8-d05d-4888-9614-19f9e3d70685" ac:name="code" ac:schema-version="1">
        <ac:parameter ac:name="language">js</ac:parameter>
        <ac:parameter ac:name="title">JSON</ac:parameter>
        <ac:parameter ac:name="collapse">true</ac:parameter>
        <ac:plain-text-body><![CDATA[${c}]]></ac:plain-text-body>
        </ac:structured-macro></td>`
      } else {
        html += `<td>${c.replace(/\&/g, ' AND ')}</td>`
      }
    })
    html += '</tr>'
  }

  html += `</table>
  <br></br>
 <h2>Triggers</h2>
 <br></br><table><tr>
 <th>Folder</th><th>Type</th><th>Name</th><th>Mapping</th><th>Tag references</th></tr>`

// loop through triggers and append to html string
// ensure last 2 columns are wrapped in a confluence code block macro

  for (i = 1; i < data.triggers.length; i++) {
    html += '<tr>'
    //html += `<td><pre>${c.replace(/\&/g, ' AND ')}</pre></td>`
    data.triggers[i].forEach((c, i) => {

      if (c && i > 2) {
        //html += `<td><pre>${c.replace(/\&/g, ' AND ')}</pre></td>`
        html += `<td><ac:structured-macro ac:macro-id="ae7f83d8-d05d-4888-9614-19f9e3d70685" ac:name="code" ac:schema-version="1">
        <ac:parameter ac:name="language">js</ac:parameter>
        <ac:parameter ac:name="title">JSON</ac:parameter>
        <ac:parameter ac:name="collapse">true</ac:parameter>
        <ac:plain-text-body><![CDATA[${c}]]></ac:plain-text-body>
        </ac:structured-macro></td>`
      } else {
        html += `<td>${(c||'').replace(/\&/g, ' AND ')}</td>`
      }
    })
    html += '</tr>'
  }

  html += `</table><br></br>
 <h2>Variables</h2>
 <br></br><table><tr>
 <th>Folder</th><th>Type</th><th>Name</th><th>Mapping</th><th>Tag references</th></tr>`

  // loop through variables and append to html string
  // ensure last 4 columns are wrapped in a confluence code block macro

  for (i = 1; i < data.variables.length; i++) {
    html += '<tr>'
   
    data.variables[i].forEach((c, i) => {

      if (c && i > 2) {
        //html += `<td><pre>${c.replace(/\&/g, ' AND ')}</pre></td>`
        html += `<td><ac:structured-macro ac:macro-id="ae7f83d8-d05d-4888-9614-19f9e3d70685" ac:name="code" ac:schema-version="1">
        <ac:parameter ac:name="language">js</ac:parameter>
        <ac:parameter ac:name="title">JSON</ac:parameter>
        <ac:parameter ac:name="collapse">true</ac:parameter>
        <ac:plain-text-body><![CDATA[${c}]]></ac:plain-text-body>
        </ac:structured-macro></td>`
      } else {
        html += `<td>${c.replace(/\&/g, ' AND ')}</td>`
      }
    })
    html += '</tr>'
  }

  html += '</table>'

  // variable to store the confluence page url

  var url = `https://${data.confluenceDomain}/wiki/rest/api/content/${data.confluencePageId}`;

  // call the confluence API to get last updated version of the page

  var getPage = UrlFetchApp.fetch(`https://${data.confluenceDomain}/wiki/rest/api/content/${data.confluencePageId}/history`, {
    headers: {
      'Authorization': `Bearer ${data.confluenceAPIToken}`,
      'Accept': "application/json"
    }
  })

  // store the last updated version number

  var pageJSON = JSON.parse(getPage).lastUpdated.number;

  // build the request JSON object mapping the page name and html string

  const bodyData = {
    "version": {
      "number": pageJSON + 1
    },
    "title": `${data.confluencePageName}`,
    "type": "page",
    "status": "current",
    "body": {
      "storage": {
        "value": html,
        "representation": "storage"
      }
    }
  };

  // make the confluence API call

  var options = {
    method: 'PUT',
    //payload: jsonPayload,
    headers: {
      'Authorization': `Bearer ${data.confluenceAPIToken}`,
      'Content-Type': "application/json",
      'Accept': 'application/json',

    },
    payload: JSON.stringify(bodyData),
    muteHttpExceptions: true


  }
  var result = UrlFetchApp.fetch(url, options);
  var resultJSON = JSON.parse(result)

 

}
