import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import { getJobs } from '../lib/graphql/queries';

function HomePage() {

  const [jobs, setjobs] = useState([])

  useEffect(()=>{
    const fetchData = async ()=>{
      getJobs().then(setjobs)
    }
    fetchData();
  },[])

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
