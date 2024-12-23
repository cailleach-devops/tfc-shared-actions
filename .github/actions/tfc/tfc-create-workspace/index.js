const core = require('@actions/core');
const axios = require('axios');

try{
    const workSpaceName = core.getInput('workSpaceName');
    const organizationName = core.getInput('organizationName');
    const token = core.getInput('token');
    const projectId = core.getInput('projectId');
	
	console.log("token="+ token);

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