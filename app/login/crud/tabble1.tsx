import React, { useState } from "react";
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
import { faPenToSquare, faTrashAlt,faPlus } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert2';

interface Table1Props {
    data: string[][];
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    sortColumn: string | null;
    sortOrder: "asc" | "desc";
    sortByColumn: (column: string) => void;
    itemsPerPage: number;
    onEditClick: (index: any) => Promise<void>;
    setData: React.Dispatch<React.SetStateAction<string[][]>>;
    onDeleteClick: (index: any) => Promise<void>;
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
    setData,
    onEditClick,
    onDeleteClick,
}) => {
    const handleAdd = async (data: any) => {
        swal.fire({
            title: "Add New Data",
            html:
                `<input id="newStaffID" class="swal2-input" placeholder="Staff ID">` +
                `<input id="newMerchantID" class="swal2-input" placeholder="Merchant ID">` ,
               
            showCancelButton: true,
            confirmButtonText: "Save",
            preConfirm: () => {
                const name = (document.getElementById('newStaffID') as HTMLInputElement).value;
                const merchantId = (document.getElementById('newMerchantID') as HTMLInputElement).value;
             
                return [name, merchantId];
            },
        }).then(async (result) => {
            if (!result.isConfirmed || !result.value) {
                return; // Exit if the user cancels or leaves the input empty
            }
    
            const name = result.value[0];
            const merchantId = result.value[1];
    
            try {
                
                const response = await fetch("/api/data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                        name:name,
                        merchantId:merchantId
                    }),
                });
    
                if (!response.ok) {
                    console.error("Failed to add new data");
                    swal.fire({
                        text: "Failed to add new data",
                        icon: "error",
                    });
                } else {
                    console.log("Data added successfully");
                    console.log(await response.json());
                    // Update the local state with the new data
                    const newData = [...data, [name,merchantId]];
                    setData(newData);
                    swal.fire({
                        text: "Data added successfully",
                        icon: "success",
                    }).then(() => {
                        window.location.reload();
                    });
                   
                }
            } catch (error) {
                console.error("Error adding new data:", error);
                swal.fire({
                    text: "Error adding new data",
                    icon: "error",
                });
            }
        });
    };
    
    const handleDeleteClick = async (index: any) => {
        swal.fire({
            title: 'Confirm Deletion',
            text: 'Are you sure you want to delete this data?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true // Swap the positions of the confirm and cancel button
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch("/api/data", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ 
                            id: index // ส่งข้อมูลเลขประจำตำแหน่งของข้อมูลที่ต้องการลบไปยัง API
                        })
                    });
                    await onDeleteClick(index);
                    swal.fire({
                        title: 'Deleted!',
                        text: 'Your data has been deleted.',
                        icon: 'success',
                    }).then(() => {
                        window.location.reload();
                    });
                } catch (error) {
                    swal.fire({
                        title: 'Deleted!',
                        text: 'Your data has been deleted.',
                        icon: 'success',
                    }).then(() => {
                        window.location.reload();
                    });
                }
            } else if (result.dismiss === swal.DismissReason.cancel) {
                swal.fire({
                    title: 'Cancelled',
                    text: 'Your data is safe :)',
                    icon: 'error',
                });
            }
        });
    };
     
    const handleEditClick = async (index: any) => {
        const staffID = data[index][0];
        const merchantID = data[index][1];
        const timestamp = data[index][2];
    
        swal.fire({
            title: "Correct Data",
            html:
            `<input id="newStaffID" class="swal2-input" placeholder="Staff ID" value="${staffID}">` +
            `<input id="newMerchantID" class="swal2-input" placeholder="Merchant ID" value="${merchantID}">` +
            `<input id="newTimeStamp" class="swal2-input" placeholder="Timestamp" value="${timestamp}">`,
            showCancelButton: true,
            confirmButtonText: "Save",
            preConfirm: () => {
                const newStaffID = (document.getElementById('newStaffID') as HTMLInputElement).value;
                const newMerchantID = (document.getElementById('newMerchantID') as HTMLInputElement).value;
                const newTimeStamp = (document.getElementById('newTimeStamp') as HTMLInputElement).value;
                return [newStaffID, newMerchantID, newTimeStamp];
            },
            
        }).then(async (result) => {
            if (!result.isConfirmed || !result.value) {
                return; // Exit if the user cancels or leaves the input empty
            }
    
            const newStaffID = result.value[0]; // รับค่าจากกล่องข้อความสำหรับ newStaffID
            const newMerchantID = result.value[1]; // รับค่าจากกล่องข้อความสำหรับ newMerchantID
            const newTimeStamp = result.value[2];
    
            const updatedData = [...data];
            updatedData[index][0] = newStaffID;
            updatedData[index][1]=newMerchantID;
            updatedData[index][2]=newTimeStamp; // Update the staffID
    
            try {  
                const response = await fetch("/api/data", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                        timestamp: timestamp,
                        newStaffID: newStaffID,
                        newMerchantID:newMerchantID,
                        newTimeStamp:newTimeStamp,
                         // Send new staffID
                    }),
                });
    
                if (!response.ok) {
                    console.error("Failed to update data");
                    swal.fire({
                        text: "Failed to update data",
                        icon: "error",
                    });
                } else {
                    console.log("Data updated successfully");
                    console.log(await response.json());
                    setData(updatedData); // Update the local state with the new data
                    // Update the row in the table with the new data
                    swal.fire({
                        text: "Data updated successfully",
                        icon: "success",
                    });
                }
            } catch (error) {
                console.error("Error updating data:", error);
                swal.fire({
                    text: "Error updating data",
                    icon: "error",
                });
            }
        });
    };
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
                            </div>
                        </TableCell>
                        <TableCell onClick={() => sortByColumn("merchantID")}>
                            <div
                                className="flex justify-center"
                                style={{ fontSize: "16px", cursor: "pointer" }}
                            >
                                <b>MerchantID</b>
                            </div>
                        </TableCell>
                        <TableCell onClick={() => sortByColumn("timestamp")}>
                            <div
                                className="flex justify-center"
                                style={{ fontSize: "16px", cursor: "pointer" }}
                            >
                                <b>Timestamp</b>
                            </div>
                        </TableCell>
                        <TableCell>
                        <FontAwesomeIcon icon={faPlus} className="fa-lg" onClick={() => handleAdd(data)} />

                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                            <TableCell>
                                <div className="flex justify-center" style={{ fontSize: "16px" }}>{item[0]}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center" style={{ fontSize: "16px" }}>{item[1]}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center" style={{ fontSize: "16px" }}>{item[2]}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center" style={{ fontSize: "16px" }}>
                                    <FontAwesomeIcon icon={faPenToSquare} onClick={() => handleEditClick(index)} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center" style={{ fontSize: "16px" }}>
                                    <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleDeleteClick(item[2])} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter className="bg-orange-500">
                    <TableRow>
                        <TableCell>
                            <div style={{ fontSize: "16px" }}>
                                <b> Summary: {data.length} Merchant </b>
                            </div>
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                            <div className="flex items-center justify-center">
                                {/* Pagination component */}
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default Table1;
