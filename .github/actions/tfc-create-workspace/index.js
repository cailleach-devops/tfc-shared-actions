const core = require('@actions/core');
const axios = require('axios');

try{
    const workSpaceName = core.getInput('workSpaceName');
    const environmentName = core.getInput('environmentName');
    const organizationName = core.getInput('organizationName');
    const token = core.getInput('token');
    const terraformHost = core.getInput('terraformHost');
    const projectId = core.getInput('projectId');

    let request = 
    { 
      "data" : 
      { 
        "attributes": 
        { 
          "name" : workSpaceName + "-" + environmentName, 
          "execution-mode": "local",
          "file-triggers-enabled": false,
          "especulative-enabled": false,
          "working-directory": "terraform"
        },
        "type": "workspaces",
        "relationships": {
          "project": {
            "data": {
              "type": "projects",
              "id": projectId
            }
          }
        }
      }
    };

    console.log("request:" + JSON.stringify(request));

    const terraformEndpoint = "https://"+terraformHost+"/api/v2/organizations/"+organizationName+"/workspaces";
    const options = {
        headers: {'Content-Type': 'application/vnd.api+json',
                  'Authorization': 'Bearer '+token
                }       
    };
   // Invoking Terraform API
    axios.post(terraformEndpoint, request, options)
      .then((response) => {
        console.log("success:"+ JSON.stringify(response.data));
        core.setOutput("workSpaceId", response.data.data.id);
      }, (error) => {
        console.error("error:"+JSON.stringify(error.response));
        core.setFailed(error.message);
      });

} catch(error){
    core.setFailed(error.message);
}