const core = require('@actions/core');
const axios = require('axios');

try{
    const token = core.getInput('tfc-token');
    const planId = core.getInput('tfc-plan-id');

    const terraformEndpoint = "https://app.terraform.io/api/v2/plans/"+planId + "/json-output";

    const options = {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Authorization': 'Bearer '+token
        }
    };
   // Invoking Terraform API
    axios.get(terraformEndpoint, options)
      .then((response) => {

        var allChanges = `
\n
| *Type* | *Resource* | *Change* |
| ----- | ---- | ---- |
`

        for(var curResource in response.data.resource_changes) {

            if (response.data.resource_changes[curResource].change.actions.toString()!="no-op") {
                  allChanges += 
                  '|' + response.data.resource_changes[curResource].type +
                  '|' + response.data.resource_changes[curResource].name + 
                  '|' + response.data.resource_changes[curResource].change.actions.toString() + '|\n';
            }
        }

        core.setOutput("planOutput", allChanges);
      }, (error) => {
        console.error("error:"+JSON.stringify(error.response));
        core.setFailed(error.message);
      });

} catch(error){
    core.setFailed(error.message);
}
