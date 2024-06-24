// Table1.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from "@mui/material";
import {} from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";
import Paginator from "./paginator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Table1Props {
  data: string[][];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  sortColumn: string | null;
  sortOrder: "asc" | "desc";
  sortByColumn: (column: string) => void;
  itemsPerPage: number;
}

const Table1: React.FC<Table1Props> = ({
  data,
  currentPage,
  totalPages,
  setCurrentPage,
  sortColumn,
  sortOrder,
  sortByColumn,
  itemsPerPage,
}) => {
  // คำนวณ paginatedData จาก data
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <TableContainer component={Paper} style={{ flex: "0 0 70%" }}>
      <Table>
        <TableHead className="bg-orange-500">
          <TableRow>
            <TableCell onClick={() => sortByColumn("staffID")}>
              <div
                className="flex justify-center"
                style={{ fontSize: "16px", cursor: "pointer" }}
              >
                <b>Staff ID</b>
                <FontAwesomeIcon
                  icon={faArrowDownWideShort}
                  rotation={
                    sortColumn === "staffID"
                      ? sortOrder === "asc"
                        ? (180 as const)
                        : undefined
                      : undefined
                  }
                  className="ml-2"
                />
              </div>
            </TableCell>
            <TableCell onClick={() => sortByColumn("merchantID")}>
              <div
                className="flex justify-center"
                style={{ fontSize: "16px", cursor: "pointer" }}
              >
                <b>MerchantID</b>
                <FontAwesomeIcon
                  icon={faArrowDownWideShort}
                  rotation={sortOrder === "asc" ? (180 as const) : undefined}
                  className="ml-2"
                />
              </div>
            </TableCell>
            <TableCell onClick={() => sortByColumn("date")}>
              <div
                className="flex justify-center"
                style={{ fontSize: "16px", cursor: "pointer" }}
              >
                <b>Date</b>
                <FontAwesomeIcon
                  icon={faArrowDownWideShort}
                  rotation={sortOrder === "asc" ? (180 as const) : undefined}
                  className="ml-2"
                />
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((item, index) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
            >
              <TableCell>
                <div
                  className="flex justify-center"
                  style={{ fontSize: "16px" }}
                >
                  {item[0]}
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="flex justify-center"
                  style={{ fontSize: "16px" }}
                >
                  {item[1]}
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="flex justify-center"
                  style={{ fontSize: "16px" }}
                >
                  {item[2]}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-orange-500">
          <TableRow>
            <TableCell>
              <div style={{ fontSize: "16px" }}>
                {" "}
                <b> Summary: {data.length} Merchant </b>{" "}
              </div>
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <div className="flex items-center justify-center">
                <Paginator
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default Table1;
