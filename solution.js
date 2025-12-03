// PSEUDOCODE: Assign jobs to agents based on priority
//
// 1. Loop through array of the objects
// 2. Create an  array for job titles
// 3. Create an array  for job agents
// 4. Loop through the job_titles array and sort the jobtitles based on urgent tags
// 5. Create an empty array
// 6.Assign for each job_title based on priority to a job_agent who has a primary skill
//  * if the agent doesnt have primary skill check it in the secondary skills or else move to the next agent
//   7. Return the Output array

const { readFileSync } = require('fs');

const input = JSON.parse(readFileSync('sample-data/input.json', 'utf8'));
console.log("the input", input)
function assignJobs(input) {
  const agents = input
    .filter(object => object.new_agent)
    .map(object => object.new_agent);

  const requests = input
    .filter(object => object.job_request)
    .map(object => object.job_request);

  const jobs = input
    .filter(object => object.new_job)
    .map(object => object.new_job)
    .sort((a, b) => b.urgent - a.urgent);

  return requests.reduce((assignments, { agent_id }) => {
    const agent = agents.find(a => a.id === agent_id);

    if (!agent) return assignments;

    const match = jobs.find(j =>
      j.type === agent.primary_skillset[0] || j.type === agent.secondary_skillset[0]
    );

    if (!match) return assignments;

    jobs.splice(jobs.indexOf(match), 1);

    return [...assignments, {
      job_assigned: { job_id: match.id, agent_id: agent_id }
    }];

  }, []);
}

console.log(assignJobs(input))