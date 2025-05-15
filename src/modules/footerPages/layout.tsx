import { GoBackButton } from "@/components/buttons/Button";
import { ChildrenProps } from "@/utils/global-types";
import Link from "next/link";

export default function Layout({children}:ChildrenProps) {
  return (
    <>
    <Link href={"/"}><GoBackButton/></Link>
    {children}
    </>
  )
}
