import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface PaginatorProps {
  currentPage2: number;
  totalPages2: number;
  onPageChange: (page: number) => void;
}

const Paginator2: React.FC<PaginatorProps> = ({
  currentPage2,
  totalPages2,
  onPageChange,
}) => {
  const handlePageChange = (_: any, page: number) => {
    onPageChange(page);
  };

  return (
    <Stack spacing={2} direction="row" justifyContent="center">
       <Pagination  
       count={totalPages2}
        page={currentPage2}
        onChange={handlePageChange}
       size="large" />
    </Stack>
  );
};

export default Paginator2;
