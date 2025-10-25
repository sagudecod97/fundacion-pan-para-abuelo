"use strict";
import "../../styles/main.scss";
import "../../styles/pages/demo.scss";

import {
  carouselRotationHandler,
  handleCarouselOnFocus,
} from "../lib/carousel-handler";

// Carousel example - Interactivity
const carouselExampleHandler = carouselRotationHandler();
carouselExampleHandler("carousel-example-id");
handleCarouselOnFocus("carousel-example-start", "carousel-example-id");

console.log("HMR Working on demo.html");
