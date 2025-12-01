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

function assignJobs(input) {
  let agents = [];
  let requests = [];
  let jobs = [];
  for (let object of input) {

    if (object.new_agent) {
      agents.push(object.new_agent);
    }
    if (object.new_job) {
      jobs.push(object.job_request);
    }
    if (object.job_request) {
      requests.push(object.new_job);
    }
  }
  jobs.sort((a, b) => b.urgent - a.urgent);
  let assignments = [];
  for (let value of requests) {
    let agentId = value.agent_id;
    let agent;
    for (let a of agents) {
      if (a.id === agentId) {
        agent = a;
        break;
      }
    }
    if (!agent)
      continue;
    let foundJob;
    for (let job of jobs) {
      if (job.type === agent.primary_skillset[0] || job.type === agent.secondary_skillset[0]) {
        foundJob = job;
        break;
      }

    }
    if (foundJob) {
      assignments.push(
        {
          job_assigned: {
            job_id: foundJob.id,
            agent_id: agentId,
          }
        }
      );
    }

    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].id == foundJob.id) {
        for (let j = i; j < jobs.length - 1; j++) {
          jobs[j] = jobs[j + 1];
        }
        jobs.length -= 1
      }
    }
  }

  return assignments;


}

