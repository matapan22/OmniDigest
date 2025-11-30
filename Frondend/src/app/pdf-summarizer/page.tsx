import FileUpload from "@/components/UploadFile/index";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Summarizer | OmniDigest",
  description: "Your personal AI reading assistant—because life is too short for long PDFs.",
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
