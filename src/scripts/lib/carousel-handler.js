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

    const rotationInterval = setInterval(() => {
      const carouselElement = query(`#${carouselId}`);
      const containerCurrentImage = query(
        ".carousel__content-img",
        carouselElement
      );
      // Queries for each tabs array, active tab and index of current active tag
      const allTabs = [...queryAll(".carousel__tabs-tab", carouselElement)];
      const activeTab = query(".--active", carouselElement);
      const indexActiveTab = allTabs.indexOf(activeTab);
      let nextActiveTab;
      let nextActiveTabChild;

      if (indexActiveTab === allTabs.length - 1) {
        nextActiveTab = allTabs[0];
      } else {
        nextActiveTab = allTabs[indexActiveTab + 1];
      }

      nextActiveTabChild = query(".carousel__tabs-image", nextActiveTab);

      // Removes and adds active class. Defines main container background image
      activeTab.classList.remove("--active");
      nextActiveTab.classList.add("--active");
      containerCurrentImage.src = nextActiveTabChild.src;
    }, 3500);

    window[carouselId] = rotationInterval;
  };
};

export const startCarouselRotation = (carouselId, memoizedCarouselHandler) => {
  memoizedCarouselHandler(carouselId);
};

export const stopCarouselRotation = (carouselId) =>
  clearInterval(window[carouselId]);

export const handleCarouselOnFocus = (startRotationBtnId, carouselId) => {
  const startRotationBtn = document.querySelector(`#${startRotationBtnId}`);
  startRotationBtn.onfocus = () => {
    clearInterval(window[carouselId]);
  };
};
