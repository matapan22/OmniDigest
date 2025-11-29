import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page | OmniDigest",
  description: "Decoding the Noise. Amplifying Insight.",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Our Mission"
        description="We believe knowledge shouldn't be hidden behind hours of reading and watching. Leveraging advanced Multi-Modal AI, we transform complex PDFs and videos into structured, actionable summaries. Whether you are a student preparing for exams or a professional tracking industry trends, OmniDigest gives you your time back."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
