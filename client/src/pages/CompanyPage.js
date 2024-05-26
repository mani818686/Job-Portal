import { useParams } from 'react-router';
import { getCompanyById } from '../lib/graphql/queries';
import { useEffect, useState } from 'react';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();

  const [company, setcompany] = useState({})

  useEffect(()=>{
    const fetchData = async ()=>{
      getCompanyById(companyId).then(setcompany)
    }
    fetchData();
  },[])
  
  if(!company)
      return "Loading...."
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>

      <h1>Jobs at company {company.name}</h1>
      {company.jobs && <JobList jobs={company.jobs}/>}
    </div>
  );
}

export default CompanyPage;
