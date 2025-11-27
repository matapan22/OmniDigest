"use client";
import React, { useState } from "react";

const Upload = () => {
  //Add state to manage the drag-and-drop and the selected file
  const[isDragActive, setIsDragActive] = useState(false);
  const [uploadedFile, setUploadedFIle] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add the event handler functions
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFIle(e.dataTransfer.files[0]);
      // TODO: Add your file upload logic here
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUploadedFIle(e.target.files[0]);
      // TODO: Add your file upload logic here
    }
  };


  const handleSubmit = async () => {
    if (!uploadedFile) {
      alert("Please select a file first!");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", uploadedFile);

    setLoading(true);


    try {
      // This says: "Use the AWS URL if it exists; otherwise, use localhost for my testing."
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const response = await fetch(`${API_BASE_URL}/summarize/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.summary);
      setResult(data);
    } catch (error) {
      alert("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
    // This is where you will eventually send the file to your backend
    console.log("Sending file to backend:", uploadedFile.name);
    alert(`Starting summary for: ${uploadedFile.name}`);
  };

  return (
    <section id="Upload" className="overflow-hidden flex py-16 md:py-20 lg:py-15">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-7/12 xl:w-80/12 mx-auto">
            <div
              className="mb-12 rounded-xs bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s
              "
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Paste Your Link
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Paste the link to the video you would like to summarize.
              </p>
              {/* === START: NEW FILE DROP BOX === */}
              <div
                className={`mt-8 border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-200
                ${isDragActive
                    ? "border-primary bg-primary/10" // Assumes 'primary' is a color in your tailwind.config.js
                    : "border-gray-300 dark:border-gray-600"
                  }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {/* This input is hidden but accessible for clicks and screen readers */}
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleChange}
                  accept="application/pdf" // Specify file types
                />

                <label htmlFor="file-upload" className="cursor-pointer">
                  {/* Upload Icon (SVG) */}
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8m0-8h8m-8 0h-8m-12-8v12a4 4 0 01-4 4H4a4 4 0 01-4-4V12a4 4 0 014-4h8"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-primary">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF Only
                  </p>
                </label>
              </div>

              {/* Show file name after upload */}
              {uploadedFile && (
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    File selected: {uploadedFile.name}
                  </p>
                </div>
              )}
              {/* === END: NEW FILE DROP BOX === */}
              {/* Button Section */}
              <div className="mt-8 flex flex-col items-center justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!uploadedFile || loading} // Button is "off" if no file is selected
                  className={`
                    rounded-md px-9 py-4 text-base font-medium text-white transition duration-300 ease-in-out
                    ${uploadedFile && !loading
                      ? "rounded-xs bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80" 
                      : "bg-gray-400 cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  {loading ? "Processing..":"Summarize File"}
                </button>
                {/* === RESULT SECTION === */}
                {result && (
                  <div className="mt-10 w-full max-w-3xl mx-auto">
                    <div className="relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md dark:bg-gray-800 dark:text-white">
                      
                      {/* 1. HEADING SECTION */}
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased text-indigo-600 dark:text-indigo-400">
                          {result.heading}
                        </h5>
                      </div>

                      {/* 2. KEYWORDS SECTION (BADGES) */}
                      <div className="px-6 pt-4 pb-2">
                        <div className="flex flex-wrap gap-2">
                          {result.keywords.map((keyword, index) => (
                            <span 
                              key={index} 
                              className="select-none rounded-full bg-indigo-50 py-1 px-3 text-xs font-bold uppercase text-indigo-600 transition-all hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300"
                            >
                              #{keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 3. SUMMARY TEXT SECTION */}
                      <div className="p-6">
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                            {result.summary_text}
                          </p>
                        </div>
                      </div>

                      {/* OPTIONAL: Footer Actions */}
                      <div className="p-6 pt-0">
                        <button
                          className="rounded-xs bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                          type="button"
                          onClick={() => navigator.clipboard.writeText(result.summary_text)}
                        >
                          Copy Summary
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>         
          </div>
        </div>
      </div>
    </section>
  );
};

export default Upload;
