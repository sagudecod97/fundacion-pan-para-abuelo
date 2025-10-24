"use strict";
import "../../styles/main.scss";
import { carouselRotationHandler } from "../lib/carousel-handler";

const carouselExampleHandler = carouselRotationHandler();
carouselExampleHandler("carousel-example-id");

console.log("HMR Working on demo.html");
