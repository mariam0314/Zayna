import React from "react";
import HeroSection from "../sections/heroscection";
import ServiceSection from "../sections/servicesection";
import Rooms from "../sections/room";
import Cards from "../sections/cards";
import Offers from "../sections/offers";
import Testimonials from "../sections/testimonials";
import Reserve from "../sections/reserve";
import Faq from "../sections/faq";
import Ready from "../sections/ready";
export default function Homescreen() {
  return (
    <>
      <HeroSection />
      <ServiceSection />
      <Rooms />
      <Cards />
      <Offers />
      <Testimonials />
      <Reserve />
      <Faq />
      <Ready />
    </>
  );
}
