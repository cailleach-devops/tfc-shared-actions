const core = require('@actions/core');
const axios = require('axios');
var util = require('util');

try{
    const workspaceId = core.getInput('tfc-workspace-id');
    const variableName = core.getInput('variable-name');
    const variableValue = core.getInput('variable-value');
    const token = core.getInput('tfc-token');

    const createEndpoint = "https://app.terraform.io/api/v2/workspaces/"+workspaceId + "/vars";

    const options = {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Authorization': 'Bearer '+token
        }
    };

    const body = {
      "data": {
        "type":"vars",
        "attributes": {
          "key": variableName,
          "value": variableValue,
          "category":"terraform",
          "hcl":false,
          "sensitive":false
        }
      }
    }


   // Invoking Terraform API
    axios.post(createEndpoint, body, options)
      .then((response) => {

        // Do nothing, just be happy
        
      }, (error) => {

        console.error("errors: ==>" + util.inspect(error.response.data.errors));

        core.setFailed(error.response.data.errors[0].detail);
      });

} catch(error){
    core.setFailed(error.message);
}