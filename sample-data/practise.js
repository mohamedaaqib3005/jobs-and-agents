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
console.log(assignJobs(input));

function assignJobs(input) {
  let agents = [];
  let requests = [];
  let jobs = [];
  for (let object of input) {
    // console.log("the object is ", object);
    if (object.new_agent) {
      agents.push(object.new_agent);
      // console.log("the agentsmm", agents)
      // the object is  {
      //   new_agent: {
      //     id: 'ed0e23ef-6c2b-430c-9b90-cd4f1ff74c88',
      //     name: 'Mr. Peanut Butter',
      //     primary_skillset: [ 'rewards-question' ],
      //     secondary_skillset: [ 'bills-questions' ]
      //   }
      // }


      //       the agentsmm [
      //   {
      //     id: '8ab86c18-3fae-4804-bfd9-c3d6e8f66260',
      //     name: 'BoJack Horseman',
      //     primary_skillset: [],
      //     secondary_skillset: [ 'bills-questions' ]
      //   },
      //   {
      //     id: '8ab86c18-3fae-4804-bfd9-c3d6e8f66280',
      //     name: 'Joey Cowboy',
      //     primary_skillset: [ 'rewards-question' ],
      //     secondary_skillset: []
      //   },
      // ]
    }
    if (object.new_job) {
      jobs.push(object.new_job);
      //       the object is  {
      //   new_job: {
      //     id: 'f26e890b-df8e-422e-a39c-7762aa0bac36',
      //     type: 'rewards-question',
      //     urgent: false
      //   }
      // }
    }
    if (object.job_request) {
      requests.push(object.job_request);
      // the object is  { job_request: { agent_id: '8ab86c18-3fae-4804-bfd9-c3d6e8f66260' } }
    }
  }
  jobs.sort((a, b) => b.urgent - a.urgent);
  let assignments = [];
  for (let value of requests) {
    let agentId = value.agent_id;
    let agent;
    // console.log("the agentarray ", agents)
    //     the agentarray  [
    //   {
    //     id: '8ab86c18-3fae-4804-bfd9-c3d6e8f66260',
    //     name: 'BoJack Horseman',
    //     primary_skillset: [],
    //     secondary_skillset: [ 'bills-questions' ]
    //   },
    //   {
    //     id: '8ab86c18-3fae-4804-bfd9-c3d6e8f66280',
    //     name: 'Joey Cowboy',
    //     primary_skillset: [ 'rewards-question' ],
    //     secondary_skillset: []
    //   },
    // ]
    for (let a of agents) {
      if (a.id === agentId) {
        agent = a;
        // console.log("the agent", agent);
        //         the agent {
        //   id: '8ab86c18-3fae-4804-bfd9-c3d6e8f66280',
        //   name: 'Joey Cowboy',
        //   primary_skillset: [ 'rewards-question' ],
        //   secondary_skillset: []
        // }
        break;
      }
    }
    if (!agent)
      continue;
    let foundJob;
    for (let job of jobs) {
      // console.log("job", job)
      //       job {
      //   id: 'f26e890b-df8e-422e-a39c-7762aa0bac36',
      //   type: 'rewards-question',
      //   urgent: false
      // }
      if (job.type === agent.primary_skillset[0] || job.type === agent.secondary_skillset[0]) {
        foundJob = job;
        //         console.log("foundjob is", foundJob)
        //         foundjob is {
        //   id: 'c0033410-981c-428a-954a-35dec05ef1d2',
        //   type: 'bills-questions',
        //   urgent: true
        // }
        break;
      }

    }
    if (foundJob) {
      assignments.push(
        {
          job_assigned: {
            job_id: foundJob.id,
            agent_id: agent.id,
          }
        }
      );

      for (let i = 0; i < jobs.length; i++) {
        if (jobs[i].id === foundJob.id) {
          for (let j = i; j < jobs.length - 1; j++) {
            jobs[j] = jobs[j + 1];
          }
          jobs.length -= 1
        }
      }
    }

  }

  return assignments;


}

