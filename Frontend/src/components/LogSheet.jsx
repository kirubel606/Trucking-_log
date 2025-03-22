import React from "react";

const LogSheet = ({ pdf }) => {
  if (!pdf) return <p>No trip selected</p>;

  return (
    <div className="p-4 bg-white">
      <iframe 
        src={pdf} 
        title="Driver Log Sheet" 
        width="100%" 
        height="800px"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default LogSheet;
