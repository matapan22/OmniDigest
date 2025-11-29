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
    newTab: false,
        submenu: [
      {
        id: 21,
        title: "Our Mission",
        path: "/about",
        newTab: false,
      },
      {
        id: 22,
        title: "The Developer",
        path: "/workinprogress",
        newTab: false,
      },
    ],
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
        title: "PDF Summarizer",
        path: "/pdf-summarizer",
        newTab: false,
      },
      {
        id: 42,
        title: "Youtube Video Summary",
        path: "/youtube-summarizer",
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
