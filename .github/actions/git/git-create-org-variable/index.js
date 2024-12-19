const core = require('@actions/core');
const { Octokit } = require('@octokit/core');

try{
    const variableName = core.getInput("name");
    const variableValue = core.getInput("value")
    const organizationName = core.getInput('organizationName');
    

    const octokit = new Octokit({
      auth: core.getInput('token')
    })

    const response = octokit.request('POST /orgs/' + organizationName + '/actions/variables', {
      org: organizationName,
      name: variableName,
      value: variableValue,
      visibility: 'all',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    if (response.status < 400) {
        setOutput('data', response.data);
        setOutput('status', response.status);
    } else {
        core.setFailed(response.message);
    }

} catch(error){
    core.setFailed(error.message);
}
