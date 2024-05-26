import { GraphQLClient, gql } from "graphql-request";
import { getAccessToken } from "../auth";

const url = "http://localhost:9000/graphql";

const client = new GraphQLClient(url,{
  headers:()=>{
    const token = getAccessToken()
    if(token)
      return {'Authorization':`Bearer ${token}`}
    return {}
  }
});

export async function getJobs(limit,offset) {
  const query = gql`
    query Jobs($limit:Int,$offset:Int){
      jobs(limit:$limit,offset:$offset) {
        totalCount,
        jobs{
        id
        title
        company {
          name
        }
        createdAt
      }
      }
    }
  `;
  const data = await client.request(query,{limit,offset});
  return data.jobs;
}
export async function getJobById(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
          description
        }
        createdAt
        description
      }
    }
  `;
  const data = await client.request(query, { id });
  return data.job;
}

export async function getCompanyById(id) {
  const query = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        name
        description
        jobs {
          id
          title
          description
          createdAt
        }
      }
    }
  `;
  const data = await client.request(query, { id });
  return data.company;
}

export async function createJob(title, description) {
  const query = gql`
    mutation CreateJob($input:createJobInput!) {
  createJob(input:$input) {
    title,
    description,
   company {
     name,
     jobs {
       title,
     }
   }
    
  }
}
  `;
  const data = await client.request(query, { "input":{title,description }});
  return data.company;
}
