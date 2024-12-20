const core = require('@actions/core');
const { Octokit } = require('@octokit/core');

try{
    const variableName = core.getInput("name");
    const variableValue = core.getInput("value")
    const organizationName = core.getInput('organizationName');
    

    const octokit = new Octokit({
      auth: core.getInput('token')
    })

    const response = octokit.request('PATCH /orgs/' + organizationName + '/actions/variables/' + variableName, {
      value: variableValue,
      visibility: 'all',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    
    if (response.status >= 400) {
        core.setFailed(response.message);
    }

} catch(error){
    core.setFailed(error.message);
}
