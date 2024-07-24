import React from "react";

const HomePage = () => {
  return (
    <div className="container flex items-center justify-center flex-grow mx-auto">
      <div className="flex items-center justify-center">
        <img
          src={`https://maang.in/_next/image?url=https%3A%2F%2Fd3pdqc0wehtytt.cloudfront.net%2Fcourses%2F3d7728c0-4462-44da-b731-f9fb07694854.png&w=828&q=75`}
          className="rounded-xl"
          alt="Course Preview"
        />
      </div>
    </div>
  );
};

export default HomePage;
