const core = require('@actions/core');
const axios = require('axios');

try{
    const workSpaceName = core.getInput('tfc-workspace');
    const organizationName = core.getInput('tfc-organization');
    const token = core.getInput('tfc-token');
    const projectId = core.getInput('tfc-project-id');
	
    let request = 
    { 
      "data" : 
      { 
        "attributes": 
        { 
          "name" : workSpaceName, 
          "execution-mode": "remote",
          "auto-apply": true,
          "file-triggers-enabled": false,
          "especulative-enabled": true
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

    const terraformEndpoint = "https://app.terraform.io/api/v2/organizations/"+organizationName+"/workspaces";
    const options = {
        headers: {'Content-Type': 'application/vnd.api+json',
                  'Authorization': 'Bearer '+token
                }       
    };
   // Invoking Terraform API
    axios.post(terraformEndpoint, request, options)
      .then((response) => {
        core.setOutput("workSpaceId", response.data.data.id);
      }, (error) => {
        console.error("error: "+error);
        core.setFailed(error.message);
      });

} catch(error){
    core.setFailed(error.message);
}