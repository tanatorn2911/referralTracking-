// Table2.tsx
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import Paginator2 from "./paginator2";
import { MerchantData } from "./page";

interface Table2Props {
  summary: MerchantData[];
  currentPage2: number;
  totalPages2: number;
  setCurrentPage2: (page: number) => void;
  sortColumn2: string | null;
  sortOrder2: "asc" | "desc";
  sortByColumn2: (column: string) => void;
  itemsPerPage2: number;
}

const Table2: React.FC<Table2Props> = ({
  summary,
  currentPage2,
  totalPages2,
  setCurrentPage2,
  sortColumn2,
  sortOrder2,
  sortByColumn2,
  itemsPerPage2,
}) => {
  const paginatedData2 = summary.slice(
    (currentPage2 - 1) * itemsPerPage2,
    currentPage2 * itemsPerPage2
  );

  return (
    <TableContainer component={Paper} style={{ flex: "0 0 40%" }}>
      <Table>
        <TableHead className="bg-orange-500">
          <TableRow>
            <TableCell onClick={() => sortByColumn2("staffID")}>
              <div
                className="flex justify-center"
                style={{ fontSize: "16px", cursor: "pointer" }}
              >
                <b>StaffID</b>

                <FontAwesomeIcon
                  icon={faArrowUpWideShort}
                  rotation={sortOrder2 === "asc" ? (180 as const) : undefined}
                  className="ml-2"
                />
              </div>
            </TableCell>
            <TableCell onClick={() => sortByColumn2("count")}>
              <div
                className="flex justify-center"
                style={{ fontSize: "16px", cursor: "pointer" }}
              >
                <b>Quantity</b>

                <FontAwesomeIcon
                  icon={faArrowUpWideShort}
                  rotation={sortOrder2 === "asc" ? (180 as const) : undefined}
                  className="ml-2"
                />
              </div>
            </TableCell>
            <TableCell onClick={() => sortByColumn2("amount")}>
              <div className="flex justify-center" style={{ fontSize: '16px', cursor: 'pointer' }}>
                <b>Amount (THB)</b>
                {sortColumn2 === "amount" && (
                  <FontAwesomeIcon
                    icon={faCircleNotch}
                    className="ml-2"
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData2.map((item, index) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
            >
              <TableCell>
                <div
                  className="flex justify-center"
                  style={{ fontSize: "16px" }}
                >
                  {item.staffID}
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="flex justify-center"
                  style={{ fontSize: "16px" }}
                >
                  {item.count}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center" style={{ fontSize: '16px' }}>
                  {item.count * 100}  
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
                <b>Summary: {summary.length} Staff </b>{" "}
              </div>
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <div className="flex items-center justify-center">
                <Paginator2
                  currentPage2={currentPage2}
                  totalPages2={totalPages2}
                  onPageChange={(page) => setCurrentPage2(page)}
                />
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default Table2;
