//page.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Table1 from '../crud/tabble1';
import { Container, Grid, Paper } from '@mui/material';

export interface MerchantData {
  staffID: string;
  count: number;
  [key: string]: string | number;
} 

export default function CrudPage(): JSX.Element {
  const router = useRouter();

  const [dataTable1, setDataTable1] = useState<string[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data", {
          method: "GET",
        });
        if (response.ok) {
          const responseData = await response.json();
          setDataTable1(responseData.data || []);
        } else {
          console.error(`Error Status code: ${response.status}`);
        }
      } catch (error) {
        console.error("An error occurred during the request", error);
      } 
    }
    fetchData(); 
  },[])

 


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

  function handleEditClick(index: any): Promise<void> {
    throw new Error('Function not implemented.');
  }
  function handleDeleteClick(index: any): Promise<void> {
    throw new Error('Function not implemented.');
  }

  return (
    <main className="bg-gray-100 min-h-screen rounded-md" >
      <div>
        <h1>crud</h1>
      </div>
      <Container>
        <Grid>
          <Grid>
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
                setData={setDataTable1} 
                onEditClick={handleEditClick} 
                onDeleteClick={handleDeleteClick} // Pass the handleDeleteClick function
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
