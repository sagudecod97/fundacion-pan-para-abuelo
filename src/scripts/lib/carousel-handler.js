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
        ".carousel__content-img",
        carouselElement
      );
      const allTabs = [...queryAll(".carousel__tabs-tab", carouselElement)];
      const activeTab = query(".--active", carouselElement);
      const indexActiveTab = allTabs.indexOf(activeTab);
      let nextActiveTab;

      if (indexActiveTab === allTabs.length - 1) {
        nextActiveTab = allTabs[0];
      } else {
        nextActiveTab = allTabs[indexActiveTab + 1];
      }

      activeTab.classList.remove("--active");
      nextActiveTab.classList.add("--active");
      containerCurrentImage.style.backgroundImage = nextActiveTab;
      // Define image source for current image container
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
