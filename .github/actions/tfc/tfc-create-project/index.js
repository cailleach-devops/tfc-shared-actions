const core = require('@actions/core');
const axios = require('axios');

try{
	const organizationName = core.getInput('tfc-organization');
    const projectName = core.getInput('tfc-project');
    const token = core.getInput('tfc-token');
	
    let request = 
	{
	  "data": {
		"attributes": {
		  "name": projectName
		},
		"type": "projects"
	  }
	}

    const terraformEndpoint = "https://app.terraform.io/api/v2/organizations/"+organizationName+"/projects";
    const options = {
        headers: {'Content-Type': 'application/vnd.api+json',
                  'Authorization': 'Bearer '+token
                }       
    };
   // Invoking Terraform API
    axios.post(terraformEndpoint, request, options)
      .then((response) => {
        core.setOutput("tfc-project-id", response.data.data.id);
      }, (error) => {
        console.error("error: "+error);
        core.setFailed(error.message);
      });

} catch(error){
    core.setFailed(error.message);
}