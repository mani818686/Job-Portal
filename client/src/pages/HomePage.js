import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../lib/graphql/queries";
import { useSearchParams } from "react-router-dom";
import PaginationBar from "./../components/PaginationBar"

function HomePage() {
  const [searchParams] = useSearchParams();
  const page = +searchParams.get("page");
  const [jobs, setjobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(Math.max(page, 1));
  const [totalCount, setCount] = useState(0);

  const updatePage = (action) => {
    if (action === "ADD") {
      if (currentPage < totalCount / 10) setCurrentPage((p) => p + 1);
    } else {
      if (currentPage - 1 > 0) {
        setCurrentPage((p) => p - 1);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      getJobs(10, Math.max((currentPage - 1) * 10, 0) ?? 10).then((data) => {
        setjobs(data.jobs);
        setCount(data.totalCount);
      });
    };
    fetchData();
  }, [currentPage]);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      {/* <div>
        <button onClick={() => updatePage("SUB")} className="btn mr-5">
          Previous
        </button>
        <span>
          Page : {currentPage} / {Math.ceil(totalCount / 10)}
        </span>
        <button onClick={() => updatePage("ADD")} className="btn ml-5">
          Next
        </button>
      </div> */}
      <PaginationBar currentPage={currentPage} totalPages={Math.ceil(totalCount / 10)}  onPageChange={setCurrentPage}/>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
