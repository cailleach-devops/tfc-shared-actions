const core = require('@actions/core');
const axios = require('axios');

try{
	const organizationName = core.getInput('tfc-organization');
	const varsetName = core.getInput('tfc-varset-name');
    const projectId = core.getInput('tfc-project-id');
    const token = core.getInput('tfc-token');
	
	// Initial variables
	const environment = core.getInput('environment');
	const awsRegion = core.getInput('aws-region');
	const awsRole = core.getInput('aws-role');
	
	
    let request = 
	
	{
	  "data": {
		"type": "varsets",
		"attributes": {
		  "name": "${var.environment}-settings",
		},
		"relationships": {
		  "projects": {
			"data": [
			  {
				"id": projectId,
				"type": "projects"
			  }
			]
		  },
		  "vars": {
			"data": [
			  {
				"type": "vars",
				"attributes": {
			
				  "key": "environment",
				  "value": environment,
				  "category": "terraform"
				}
			  },
			  {
				"type": "vars",
				"attributes": {
			
				  "key": "region",
				  "value": awsRegion,
				  "category": "terraform"
				}
			  },
			  {
				"type": "vars",
				"attributes": {
			
				  "key": "TFC_AWS_PROVIDER_AUTH",
				  "value": true,
				  "category": "env"
				}
			  },
			  {
				"type": "vars",
				"attributes": {
			
				  "key": "TFC_AWS_RUN_ROLE_ARN",
				  "value": awsRole,
				  "category": "env"
				}
			  }
			]
		  },
		  "parent": {
			"data": {
			  "id": organizationName,
			  "type": "organizations"
			}
		  }
		}
	  }
	}

    const terraformEndpoint = "https://app.terraform.io/api/v2/organizations/"+organizationName+"/varsets";
    const options = {
        headers: {'Content-Type': 'application/vnd.api+json',
                  'Authorization': 'Bearer '+token
                }       
    };
   // Invoking Terraform API
    axios.post(terraformEndpoint, request, options)
      .then((response) => {
        
		// do nothing, just rejoice!
		
      }, (error) => {
        console.error("error: "+error);
        core.setFailed(error.message);
      });

} catch(error){
    core.setFailed(error.message);
}