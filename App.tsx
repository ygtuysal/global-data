import React, { useEffect, useState, useMemo, Suspense } from "react";
import "./App.css";
import Company from "./App.styles";

const TableWithRangeSlider: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<number>(0);
  const [companiesData, setCompaniesData] = useState<Company[]>([]);
  const [revenueRange, setRevenueRange] = useState<[number, number]>([
    0, 10000000,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/data", {
          mode: "cors",
        });
        const data = await response.json();
        setCompaniesData(data.largest_companies);
        setRevenueRange([
          Math.min(
            ...data.largest_companies.map((company: Company) => company.revenue)
          ),
          Math.max(
            ...data.largest_companies.map((company: Company) => company.revenue)
          ),
        ]);

        const initialAvgRange =
          data.largest_companies
            .map((company: Company) => company.revenue)
            .reduce((a: number, b: number) => a + b, 0) /
          data.largest_companies?.length;
        setSelectedRange(initialAvgRange);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRange(parseInt(event.target.value));
  };

  const filteredDataMemo = useMemo(() => {
    const filteredData = companiesData.filter(
      (company) => company.revenue >= 0 && company.revenue <= selectedRange
    );

    return filteredData.sort((a, b) => a.revenue - b.revenue);
  }, [companiesData, selectedRange]);

  return (
    <div className="table-container">
      <div>
        <label htmlFor="incomeRange">Income Range:</label>
        <input
          type="range"
          id="incomeRange"
          min={0}
          max={revenueRange[1]}
          value={selectedRange}
          onChange={handleRangeChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Industry</th>
            <th>Revenue</th>
            <th>Revenue Growth</th>
            <th>Employees</th>
            <th>Headquarters</th>
          </tr>
        </thead>
        <Suspense fallback={"Loading"}>
          <tbody>
            {filteredDataMemo.map((company) => (
              <tr key={company.rank}>
                <td>{company.rank}</td>
                <td>{company.name}</td>
                <td>{company.industry}</td>
                <td>{company.revenue}</td>
                <td>{company.revenue_growth}</td>
                <td>{company.employees}</td>
                <td>{company.headquarters}</td>
              </tr>
            ))}
          </tbody>
        </Suspense>
      </table>
    </div>
  );
};

export default TableWithRangeSlider;
