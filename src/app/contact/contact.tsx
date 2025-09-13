import React from "react";
import Herosection from  "./hero"
import ContactInfo from "./contactinfo";
import OpeningHours from "./openinghours";
import SocialLinks from "./sociallink";
export default function About() {
  return (
    <>
      <Herosection />
    <ContactInfo />
    <OpeningHours />
    <SocialLinks />
    </>
  );
}
