import React from "react";

const LogSheet = ({ tripData }) => {
  const {
    date,
    milesDriven,
    truckNumber,
    shippingDocNumber,
    coDriver,
  } = tripData;

  // Calculate time segments for the log sheet
  const totalHours = 24; // Assuming a 24-hour cycle
  const drivingHours = 11; // For example, driving for 11 hours in a day
  const offDutyHours = totalHours - drivingHours; // Resting for the remaining time

  // Generate remarks
  const remarks = "No adverse driving conditions, fuel stop at 1,000 miles.";

  return (
    <div className="log-sheet">
      <h3>Driver's Daily Log</h3>
      <div>
        <p>Date: {date}</p>
        <p>Total Miles Driven: {milesDriven}</p>
        <p>Truck Number: {truckNumber}</p>
        <p>Shipping Document Number: {shippingDocNumber}</p>
        <p>Co-Driver: {coDriver}</p>
      </div>

      <div className="log-grid">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Driving</th>
              <th>On Duty (Not Driving)</th>
              <th>Sleeper Berth</th>
              <th>Off Duty</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(24).keys()].map((hour) => (
              <tr key={hour}>
                <td>{hour}:00</td>
                <td>{hour < drivingHours ? "X" : ""}</td>
                <td>{hour >= drivingHours && hour < totalHours - offDutyHours ? "X" : ""}</td>
                <td>{hour >= totalHours - offDutyHours ? "X" : ""}</td>
                <td>{hour >= totalHours - offDutyHours ? "X" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>Remarks: {remarks}</p>
    </div>
  );
};

export default LogSheet;
