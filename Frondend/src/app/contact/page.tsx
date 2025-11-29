import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | OmniDigest",
  description: "This is Contact Page for Startup Nextjs Template",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Page"
        description="We are constantly refining our algorithms. Whether you found a bug or have a brilliant idea for the next feature, your feedback helps shape the future of this platform."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
