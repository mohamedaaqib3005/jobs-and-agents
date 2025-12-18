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

function parseInput(input, key) {
  return input
    .filter(object => object[key])
    .map(object => object[key])
}


function assignJobs(input) {
  const agents = parseInput(input, "new_agent");
  const requests = parseInput(input, "job_request");
  const jobs = parseInput(input, "new_job")
    .sort((a, b) => b.urgent - a.urgent);

  function findAgentById(agent_id) {
    return agents.find(a => a.id === agent_id);
  }
  const result = requests.reduce(({ assignments, remainingJobs }, { agent_id }) => {
    const agent = findAgentById(agent_id)
    if (!agent) throw new Error("agent not available");

    const primaryMatch = remainingJobs.find((job) => agent.primary_skillset.includes(job.type))

    const match = primaryMatch || remainingJobs.find((job) => agent.secondary_skillset.includes(job.type))

    if (!match) return { assignments, remainingJobs };

    // jobs.splice(jobs.indexOf(match), 1);
    const index = remainingJobs.indexOf(match)
    // remainingJobs.toSpliced(jobs.indexof(match), 1)

    return {
      assignments: [
        ...assignments,
        { job_assigned: { job_id: match.id, agent_id } }
      ],
      remainingJobs: remainingJobs.toSpliced(index, 1)
    }

  }, {
    assignments: [],
    remainingJobs: jobs
  });


  const assignments = result.assignments;
  return assignments;

}
console.log(assignJobs(input))

// catch the error after throwing the error ;
// h.o.f should  not perform  mutations (splice);
// create a fn for reduce called generateAssignments;
