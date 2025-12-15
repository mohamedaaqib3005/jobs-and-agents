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
  const agents = input// create a func called parseInput it should not be more than WET
    .filter(object => object.new_agent)
    .map(object => object.new_agent);

  const requests = input
    .filter(object => object.job_request)
    .map(object => object.job_request);

  const jobs = input
    .filter(object => object.new_job)
    .map(object => object.new_job)
    .sort((a, b) => b.urgent - a.urgent);

  return requests.reduce((assignments, { agent_id }) => {//change to map
    const agent = agents.find(a => a.id === agent_id); // create a func findAgentbyid

    if (!agent) return assignments; // throw an error when there is no agent

    // const match = jobs.find(job =>
    //   job.type === agent.primary_skillset[0]//prioritise primary skillset and then check secondary skillset
    //   || job.type === agent.secondary_skillset[0]
    // );// create func matchJobs

    const primarymatch = jobs.find((job) => agent.primary_skillset.includes(job.type))

    const secondarymatch = jobs.find((job) => agent.secondary_skillset.includes(job.type))

    const match = primarymatch || secondarymatch;
    if (!match) return assignments;

    jobs.splice(jobs.indexOf(match), 1);
    return [...assignments, {
      job_assigned: { job_id: match.id, agent_id: agent_id }
    }];

  }, []);
}

console.log(assignJobs(input))

// make changes based on the  rule 5 only assign if it has primary skillset
