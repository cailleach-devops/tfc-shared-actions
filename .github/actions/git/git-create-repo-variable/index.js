const core = require('@actions/core');
const axios = require('axios');

try{
    const variableName = core.getInput("variable-name");
    const variableValue = core.getInput("variable-value")
    const organizationName = core.getInput('git-organization');
    const repositoryName = core.getInput('git-repository');
    const token = core.getInput("git-token");

    const createEndpoint = 'https://api.github.com/repos/' + organizationName + '/' + repositoryName + '/actions/variables';
    const updateEndpoint = createEndpoint + '/' + variableName;

    const options = {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/vnd.github+json',
          'Authorization': 'Bearer '+token
        }
    };

    const body = {
      name: variableName,
      value: variableValue,
      visibility: 'all'
    };
    
    axios.post(createEndpoint, body, options)
        .then( (success) => {

            core.setOutput('status', 201);

        }, (createError) => {

            if (createError.response) {

                if (createError.response.status == 409) {

                    axios.patch(updateEndpoint, body, options)
                        .then( (updated) => {

                            core.setOutput('status', 201);

                        }, (updateError) => {
                            throw { message: error.response.message, status: error.response.status };
                        }
                        )

                } else {
                    throw { message: createError.response.message, status: createError.response.status };
                }
            } else {
                throw { message: createError.response.message, status: createError.response.status };
            }


        }
    );

} catch(anyError){
    core.setOutput('data', anyError.message);
    core.setOutput('status', anyError.status);
    core.setFailed(anyError.message);
}
