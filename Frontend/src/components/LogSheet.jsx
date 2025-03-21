import React, { useRef } from "react";

const LogSheet = ({ tripData, logEntries }) => {
  if (!tripData) return <p>No trip selected</p>;

  const printRef = useRef(); // Reference for printing only log sheets
  const tripDays = Math.ceil(tripData.duration) || 1; // Ensure at least one day is displayed
  const handlePrint = () => {
    if (printRef.current) {
      const originalContents = document.body.innerHTML;
      const printContents = printRef.current.innerHTML;

      document.body.innerHTML = printContents; // Set only the log sheet content
      window.print();
      document.body.innerHTML = originalContents; // Restore original page content
      window.location.reload(); // Reload page to restore event listeners
    }
  };
  const rows = 4;
  const columns = 24;
  // Generate a 2D array for rows and columns
  const generateTableData = () => {
    return Array.from({ length: rows }, () => Array(columns).fill(''));
  };

  const tableData = generateTableData();
  return (
    <div className="p-4 bg-white">
      <div ref={printRef} className="print:bg-white print:shadow-none">
        {Array.from({ length: tripDays }).map((_, dayIndex) => {
          const logsForDay = logEntries.filter((log) => log.dayIndex === dayIndex);

          return (
            <div ref={printRef} key={dayIndex} className="border p-6 mb-6 shadow-lg bg-white">
              {/* Header Section */}
              <div className="flex justify-between mb-4">
                <div className="flex">
                  <h2 className="text-xl font-semibold mr-52">Driver’s Daily Log</h2>
                  <div>
                    <p className=" font-bold text-lg">{tripData.date}</p>
                    <p className="text-sm ">(YYYY-MM-DD)</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p>Original - file at home terminal </p>
                  <p>Duplicate - Driver retains in his/her possession for 8 days </p>
                </div>
              </div>
              <div className="flex justify-between  mb-4 mx-44">
                    <div>
                      <p className=" border-b-2 w-[100%] text-center border-black">From: {tripData.pickup_location}</p>
                    </div>
                    <div>
                      <p className=" border-b-2 w-[100%] text-center border-black">To: {tripData.dropoff_location}</p>
                    </div>
                  </div>
              <div className="grid grid-cols-2">
                <div>
                  <div className="flex justify-between  mb-4 w-1/2">
                    <div>
                      <div className="min-w-56 h-5 p-6 border-2 border-black mx-2 text-center font-bold"></div>
                      <p className="text-center">Total Miles Driving Today</p>
                    </div>
                    <div>
                      <div className="min-w-56 h-5 p-6 border-2 border-black mx-2 text-center font-bold">{tripData.total_miles}</div>
                      <p className="text-center">Total Mileage </p>
                    </div>
                  </div>
                  <div className="justify-between  mb-5 w-full">
                      <div className="ml-2 w-full h-5 p-6 border-2 border-black mr-2 mx-auto text-center font-bold">{tripData.truck_number}</div>
                      <p className="text-center">Truck/Tracktor and Trailer Numbers or Licence Plate(s) /State(Show each unit)</p>
                  </div>
                </div>


                <div>
                  <div className="w-[90%] mx-auto mt-8 border-black border-t-2 text-center">Name of Carrier</div>
                  <div className="w-[90%] mx-auto mt-8 border-black border-t-2 text-center">Main office Address</div>
                  <div className="w-[90%] mx-auto mt-8 border-black border-t-2 text-center">Home Terminal Address</div>
                </div>
              </div>

            <div className="mt-5">



            </div>

              {/* Remarks & Signature */}
              <div className="mt-4">
                <p className="font-semibold">Remarks:</p>
                <textarea
                  className="border w-full p-2 h-16"
                  defaultValue={tripData.remarks}
                />
              </div>

              <div className="flex justify-between mt-4">
                <div>
                  <p>Driver’s Signature: _____________________</p>
                </div>
                <div>
                  <p>Date: {tripData.date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      
      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Print Log Sheet
      </button>

      {/* Print Styles - Hide Everything Else */}
      <style>{`
        @media print {
          @page {
            size: landscape; /* Set print orientation to landscape */
          }
          body * {
            visibility: hidden;
          }
          .print-only, .print-only * {
            visibility: visible;
          }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

// Function to apply styles based on log data
const getLogStyle = (logs, hour, status) => {
  return logs.some((log) => log.hour === hour && log.status === status)
    ? "bg-blue-400"
    : "bg-white";
};

export default LogSheet;
