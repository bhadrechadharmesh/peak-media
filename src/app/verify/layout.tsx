import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Certificate",
  description:
    "Verify the authenticity of a Peak Media internship certificate by entering its certificate number.",
  robots: { index: true, follow: true },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
