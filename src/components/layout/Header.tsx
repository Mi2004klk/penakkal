import { getNavCategories } from "@/lib/articles";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const navCategories = await getNavCategories();
  return <HeaderClient navCategories={navCategories} />;
}
