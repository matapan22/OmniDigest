import FileUpload from "@/components/Upload File/index";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page | Free Next.js Template for Startup and SaaS",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="PDF Summarizer"
        description="Your personal AI reading assistant—because life is too short for long PDFs."
      />
      <FileUpload />
    </>
  );
};

export default AboutPage;
