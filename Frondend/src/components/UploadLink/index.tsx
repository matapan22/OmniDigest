"use client";
import React, { useState } from "react";

export function YoutubePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Use your env variable
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleSubmit = async () => {
    if (!url) return alert("Please enter a YouTube URL");

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/summarize-youtube/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) throw new Error("Failed to summarize video");

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
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
              {/* INPUT CARD */}
          <div className="rounded-sm bg-white p-8 shadow-three dark:bg-gray-dark sm:p-[55px]">
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                YouTube URL
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
              />
            </div>
            <div className="flex justify-center">
                              <button
                  onClick={handleSubmit}
                  disabled={isLoading} // Button is "off" if no file is selected
                  className={`
                    rounded-md px-9 py-4 text-base font-medium text-white transition duration-300 ease-in-out
                    ${!isLoading
                      ? "rounded-xs bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80" 
                      : "bg-gray-400 cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  {isLoading ? "Watching Video...":"Summarize Video"}
                </button>
            </div>
          </div>





              {/* Button Section */}
              <div className="mt-8 flex flex-col items-center justify-center">
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

export default YoutubePage;
