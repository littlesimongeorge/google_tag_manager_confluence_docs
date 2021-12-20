function callGoogleAPIs(config) {

  var config = config;
  var folders, triggers = {}, tags, tagFiringTriggerReference = {}, tagBlockingTriggerReference = {},
    data = {
      confluenceAPIToken: config.confluenceAPIToken,
      confluencePageId: config.confluencePageId,
      confluencePageName: config.confluencePageName,
      confluenceDomain: config.confluenceDomain,
      container: '',
      version: '',
      tags: [],
      variables: [],
      triggers: []
    };

  // get the  google analytics custom dimensions and re-map 

  var cds = Analytics.Management.CustomDimensions.list(`${config.gaAccountId}`, `${config.gaMeasurementId}`)
    .items
    .map(function (view) {
      return {
        index: view.index,
        name: view.name
      }
    });

  var metrics = Analytics.Management.CustomMetrics.list(`${config.gaAccountId}`, `${config.gaMeasurementId}`)
    .items
    .map(function (view) {
      return {
        index: view.index,
        name: view.name
      }
    });

  // get live gtm container

  var latestVersion = TagManager.Accounts.Containers.Versions.live(`accounts/${config.gtmAccountId}/containers/${config.gtmContainerId}`);

  folders = latestVersion.folder;
  tags = latestVersion.tag;
  data.container = latestVersion.container.publicId;
  data.version = latestVersion.containerVersionId;

  // build a simple triggers lookup 

  for (const { triggerId, name, type } of latestVersion.trigger) {
    triggers[triggerId] = { name: name, type: type }
  }

  // add each tag to the data object
  tags
    .forEach(tag => {

      // trigger logic to return trigger names rather than ids
      // loop through trigger Ids - check if id exists in lookup object - return the trigger name from lookup object

      let firing = [];
      try {
        for (let id of tag.firingTriggerId) {
          if (triggers[id]) {

            firing.push(triggers[id])
            if (!tagFiringTriggerReference[id]) {
              tagFiringTriggerReference[id] = [tag.name];
            } else {
              tagFiringTriggerReference[id].push(tag.name);
            }
          }
        }
      } catch (e) {

      }


      // blocking trigger logic to return blocking trigger names rather than ids
      // loop through blocking trigger Ids - check if id exists in lookup object - return the trigger name from lookup object

      let blocking = [];
      try {
        for (let id of tag.blockingTriggerId) {
          if (triggers[id]) {

            blocking.push(triggers[id])
            if (!tagBlockingTriggerReference[id]) {
              tagBlockingTriggerReference[id] = [tag.name];
            } else {
              tagBlockingTriggerReference[id].push(tag.name);
            }
          }
        }
      } catch (e) {

      }



      // logic to get dimension names from GA API
      // loop through tag.parameter array filtered to dimension mapping - loop through tag.parameter[i].list - loop through tag.parameter[i].list[i].map
      // get the dimension index
      // filter the custom dimensions object by the dimension index and push to gaDimensions array

      let gaDimensions = []

      for (const { list = [] } of tag.parameter.filter(param => param.key == 'dimension')) {
        for (const { map } of list) {
          try {
            let localMapping = map;
            let index = localMapping.filter(lm => lm.key == 'index')[0].value;
            gaDimensions.push(cds.filter(dimension => dimension.index == index)[0])

          } catch (e) {

          }
        }
      }

      let gaMetrics = []

      for (const { list = [] } of tag.parameter.filter(param => param.key == 'metric')) {
        for (const { map } of list) {
          try {
            let localMapping = map;
            let index = localMapping.filter(lm => lm.key == 'index')[0].value;
            gaMetrics.push(metrics.filter(met => met.index == index)[0])

          } catch (e) {

          }
        }
      }

      // push folder name, tag type, tag name, firing & blocking triggers and parameter mapping

      data.tags.push([
        ((folders.filter(f => {
          return f.folderId == tag.parentFolderId;
        })[0] || {}).name || 'Unfiled Item'),
        tag.type,
        tag.name,
        JSON.stringify({ firing: firing, except: blocking }, null, 2),
        JSON.stringify(tag.parameter, null, 2),
        JSON.stringify(gaDimensions, null, 2),
        JSON.stringify(gaMetrics, null, 2),

      ])
    })

  // add triggers to data object  
  latestVersion.trigger
    .forEach(trigger => {

      // get tags which reference this trigger 

      let firing = tagFiringTriggerReference[trigger.triggerId] || [];


      // get tags which reference this trigger for blocking

      let blocking = tagBlockingTriggerReference[trigger.triggerId] || [];

      data.triggers.push([
        ((folders.filter(f => {
          return f.folderId == trigger.parentFolderId;
        })[0] || {}).name || ''),
        trigger.type,
        trigger.name,
        JSON.stringify({ firing: firing, except: blocking }, null, 2),
        JSON.stringify(trigger.customEventFilter, null, 2)

      ])

    })

  // add variables to data object 
  latestVersion.variable
    .forEach(macro => {

      var references = tags
        .filter(tag => {
          return JSON.stringify(tag).includes(macro.name)
        }).map(t => {
          return { name: t.name, type: t.type };
        })

      data.variables.push([
        ((folders.filter(f => {
          return f.folderId == macro.parentFolderId;
        })[0] || {}).name || ''),
        macro.type,
        macro.name,
        JSON.stringify(macro.parameter, null, 2),
        JSON.stringify(references, null, 2)

      ])

    })


  console.log('documented: ', { data: { tags: data.tags.length, triggers: data.triggers.length, variables: data.variables.length } });
  uploadToConfluenceSDR(data);

}
