import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (_: any, page: number) => {
    onPageChange(page);
  };

  return (
    <Stack spacing={2} direction="row" justifyContent="center">
       <Pagination  
       count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
       size="large" />
    </Stack>
  );
};

export default Paginator;
