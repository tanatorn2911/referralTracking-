"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Initial loading state is set to false

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please Enter StaffID",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          title: "text-danger",
        },
      });

      return;
    } else if (name.length !== 5) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Staff ID Incorrect",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          title: "text-danger",
        },
      });

      return;
    }

    setLoading(true);

    setTimeout(() => {
      sessionStorage.setItem("id", name);
      router.push("/scanqr");

      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setName(numericValue);
  };

  return (
    <main className="bg-gray-100  flex items-center justify-center">
      <div></div>
      <div>
        <form
          className="px-8 pt-6 py-4 space-y-4 max-w-[900px]"
          onSubmit={handleSubmit}
        >
        
          <div className="flex items-center justify-center">
            <div></div>
            <div>
            </div>
            <div></div>
          </div>
          <div className="max-w-5xl mx-auto py-20">
            <div className="flex items-center justify-center h-[20px] mb-[80px]">
              <input
                value={name}
                onChange={handleChange}
                type="text"
                name="name"
                id="name"
                maxLength={5}
                className="shadow-md focus:ring-indigo-500 focus:border-indigo-500 block border-gray-300 rounded-lg h-[50px] w-full max-w-[300px]"
                placeholder="  Staff ID"
              />
            </div>

            <div className="flex justify-center min-w-full">
              <button
                type="submit"
                className="flex items-center min-w-full justify-center text-lg w-full rounded-xl shadow py-4 px-2 text-white bg-orange-500"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      spin
                      className="text-white mr-2"
                    />
                    Loading...
                  </>
                ) : (
                  "ENTER"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div></div>
    </main>
  );
}
