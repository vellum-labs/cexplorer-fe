import { ContactUsPage } from "@/pages/article/ContactUs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact-us/")({
  component: () => <ContactUsPage />,
});
