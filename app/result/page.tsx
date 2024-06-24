"use client"
import React, { useState, useEffect } from "react";
import {
  Container, Grid, Paper,
} from "@mui/material";
import LoadingOverlay from "../loading";
import Chart from "./Chart";
import Table1 from "./table1";
import Table2 from "./table2";

export interface MerchantData {
  staffID: string;
  count: number;
  [key: string]: string | number;
}

export default function Result(): JSX.Element {
  const [summary, setSummary] = useState<MerchantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataTable1, setDataTable1] = useState<string[][]>([]);
  const [dataTable2, setDataTable2] = useState<string[][]>([]);

  //api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data", {
          method: "GET",
        });
        if (response.ok) {
          const responseData = await response.json();
          setDataTable2(responseData.data || []);
          setDataTable1(responseData.data || []);
        } else {
          console.error(`Error Status code: ${response.status}`);
        }
      } catch (error) {
        console.error("An error occurred during the request", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  //
  //คำนวนนับจำนวน

  useEffect(() => {
    const processedData = dataTable2.reduce((accumulator, currentItem) => {
      const staffID = currentItem[0] as string;
      const existingItem = accumulator.find((item) => item.staffID === staffID);

      if (existingItem) {
        existingItem.count += 1;
      } else {
        accumulator.push({ staffID, count: 1 });
      }

      return accumulator;
    }, [] as MerchantData[]);
    setSummary(processedData);
  }, [dataTable2]);
  //
  //sorting table1
  const dataColumns = ["staffID", "merchantID", "date"];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(dataTable1.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const sortByColumn = (column: string) => {
    const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(order);

    const sortedData = [...dataTable1].sort((a, b) => {
      const aValue = a[dataColumns.indexOf(column)];
      const bValue = b[dataColumns.indexOf(column)];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setDataTable1(sortedData);
  };

  //sorting table2
  const [currentPage2, setCurrentPage2] = useState(1);
  const itemsPerPage2 = 10;
  const totalPages2 = Math.ceil(summary.length / itemsPerPage2);
  const [sortColumn2, setSortColumn2] = useState<string | null>(null);
  const [sortOrder2, setSortOrder2] = useState<'asc' | 'desc'>('asc');
  const sortByColumn2 = (column: string) => {
    const order = sortColumn2 === column && sortOrder2 === 'asc' ? 'desc' : 'asc';
    setSortColumn2(column);
    setSortOrder2(order);
    const sortedSummary = [...summary].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setSummary(sortedSummary);
  };

 

  return (
    <main className="bg-gray-100 min-h-screen rounded-md">
      {loading && <LoadingOverlay />}
      <div className="flex items-center justify-center m-[10px]">
        <h1 className="text-[40px]">Merchant App Referral Tracking</h1>
      </div>
      <Container>
        <Chart summary={summary} />
        <Grid container spacing={4}>
          <Grid item xs={12} sm={7}>
            <Paper>
              <Table1
                data={dataTable1}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                sortByColumn={sortByColumn}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Paper>
              <Table2
                summary={summary}
                currentPage2={currentPage2}
                setCurrentPage2={setCurrentPage2}
                sortColumn2={sortColumn2}
                sortOrder2={sortOrder2}
                sortByColumn2={sortByColumn2}
                totalPages2={totalPages2}
                itemsPerPage2={itemsPerPage2}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
