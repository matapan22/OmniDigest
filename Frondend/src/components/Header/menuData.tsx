import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "About",
    path: "/about",
    newTab: false,
  },
  {
    id: 3,
    title: "Support",
    path: "/contact",
    newTab: false,
  },
  {
    id: 4,
    title: "Pages",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "PDF Summarization",
        path: "/PDF",
        newTab: false,
      },
      {
        id: 42,
        title: "Youtube Video Summary",
        path: "/workinprogress",
        newTab: false,
      },
      {
        id: 42,
        title: "Word Cloud Generator",
        path: "/workinprogress",
        newTab: false,
      },
    ],
  },
];
export default menuData;
