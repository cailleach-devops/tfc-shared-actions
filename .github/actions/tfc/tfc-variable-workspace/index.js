const core = require('@actions/core');
const axios = require('axios');

try{
    const workspaceId = core.getInput('workspaceId');
    const variableName = core.getInput('variableName');
    const variableValue = core.getInput('variableValue');
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


        core.setOutput("planOutput", allChanges);
      }, (error) => {
        console.error("error:"+JSON.stringify(error.response));
        core.setFailed(error.message);
      });

} catch(error){
    core.setFailed(error.message);
}