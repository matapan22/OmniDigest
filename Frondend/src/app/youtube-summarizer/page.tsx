import LinkUpload from "@/components/UploadLink/index";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Youtube Summarizer | OmniDigest",
  description: "Your personal AI Summarizer assistant because life is too short for long Youtube Videos.",
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
