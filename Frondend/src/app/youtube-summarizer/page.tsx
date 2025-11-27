import LinkUpload from "@/components/UploadLink/index";
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
        pageName="Youtube Summarizer"
        description="Your personal AI Summarizer assistant because life is too short for long Youtube Videos."
      />
      <LinkUpload />
    </>
  );
};

export default AboutPage;
