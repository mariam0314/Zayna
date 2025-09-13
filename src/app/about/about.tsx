import React from "react";
import Herosection from  "./hero"
import Introduction from "./story";
import Fascilites from "./fascilites";
import Awards from "./award";
export default function About() {
  return (
    <>
      <Herosection />
      <Introduction />
      <Fascilites />
    <Awards />
    </>
  );
}
