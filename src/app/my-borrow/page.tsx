import type { Metadata } from "next";
import MyBorrows from "@/components/MyBorrow";

export const metadata: Metadata = { title: "My Borrows" };

export default function MyBorrowsPage() {
  return <MyBorrows />;
}