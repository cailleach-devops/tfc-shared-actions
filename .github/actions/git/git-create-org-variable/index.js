const core = require('@actions/core');
const { Octokit } = require('@octokit/core');

try{
    const variableName = core.getInput("name");
    const variableValue = core.getInput("value")
    const organizationName = core.getInput('organizationName');
    

    const octokit = new Octokit({
      auth: core.getInput('token')
    })

    createResponse = createVariable(octokit, organizationName, variableName, variableValue);

    if (createResponse.status == 409) {

        updateResponse = updateVariable(octokit, organizationName, variableName, variableValue);

        if (updateResponse.status >= 400) {
            throw { message: response.data, status: response.status }
        }

    } else if (createResponse.status >= 400) {
        throw { message: response.data, status: response.status }
    }

} catch(error){
    core.setOutput('data', error.message);
    core.setOutput('status', error.status);
    core.setFailed(error.message);
}


function createVariable(octokit, organizationName, variableName, variableValue) {

    return octokit.request('POST /orgs/' + organizationName + '/actions/variables', {
      name: variableName,
      value: variableValue,
      visibility: 'all',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
}


function updateVariable(octokit, organizationName, variableName, variableValue) {

   return octokit.request('PATCH /orgs/' + organizationName + '/actions/variables/' + variableName, {
      value: variableValue,
      visibility: 'all',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
}