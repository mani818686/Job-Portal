import { getCompany } from "./db/companies.js";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  getJobsCount,
  updateJob,
} from "./db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    jobs: async (_root, { limit,offset }) => {
      const jobs = await getJobs(limit,offset)
      const totalCount = await getJobsCount()
      return {jobs:jobs,totalCount:totalCount}
    },
    company: async (_root, args) => {
      const data = await getCompany(args.id);
      console.log(data);
      if (data != null) return data;
      else throw notFoundError("Company Not Found");
    },
    job: async (_root, args) => {
      const job = await getJob(args.id);
      if (job) return job;
      else throw notFoundError("Job Not Found");
    },
  },
  Mutation: {
    createJob: async (_root, { input: { title, description } }, { user }) => {
      console.log(user, "Authorization");
      if (!user) throw new unAuthorizedError();
      const companyId = user.companyId;
      return createJob({ companyId, title, description });
    },
    deleteJob: async (_root, args, { user }) => {
      if (!user) throw new unAuthorizedError();
      return deleteJob(args.id);
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { auth }
    ) => {
      if (!auth) throw new unAuthorizedError();
      return updateJob({ id, title, description });
    },
  },
  Job: {
    createdAt: (job) => {
      return convertToISODate(job.createdAt);
    },
    company: (job) => getCompany(job.companyId),
  },
  Company: {
    jobs: async (company) => getJobsByCompany(company.id),
  },
};

function notFoundError(message) {
  throw new GraphQLError(message, {
    extensions: {
      code: "NOT_FOUND",
    },
  });
}
function unAuthorizedError() {
  throw new GraphQLError("User is not authorised!!", {
    extensions: {
      code: "UNAUTHORISED",
    },
  });
}
function convertToISODate(date) {
  return date.slice(0, "yyyy-mm-dd".length);
}
