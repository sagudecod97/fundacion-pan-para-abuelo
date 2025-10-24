"use strict";
import { query, queryAll } from "./dom";

const ENTER = "Enter";
const TAB = "Tab";
const ARROW_RIGHT = "ArrowRight";
const ARROW_LEFT = "ArrowLeft";
const HOME = "Home";
const END = "End";

export const carouselRotationHandler = () => {
  // Value to check if user hasn't interacted with Carousel
  let initialRender = true;

  return (carouselId) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      initialRender
    ) {
      initialRender = false;
      return;
    }

    const carouselElement = document.querySelector("#carousel-example-id");
    const rotationInterval = setInterval(() => {
      const containerCurrentImage = query(
        ".carousel__content",
        carouselElement
      );
      // const tabsElement = query(".carousel__tabs", carouselElement); Check if this is really needed
      const activeTab = query(".--active", carouselElement);
      console.log("Active: ", activeTab);
    }, 3000);

    window[carouselId] = rotationInterval;
  };
};

export const startCarouselRotation = (carouselId, memoizedCarouselHandler) => {
  memoizedCarouselHandler(carouselId);
};

export const stopCarouselRotation = (carouselId) =>
  clearInterval(window[carouselId]);

export const handleCarouselOnFocus = () => {};
