import { query, queryAll } from "./dom";

export class Carousel {
  constructor(carouseldId) {
    this.carouselId = carouseldId;
    this.initialRender = true;
    this.mainContainer;
    this.carouselImage;
    this.toggleRotationBtn;
    this.toggleRotationIcon;
    this.tabsContainer;
    this.tabsElements;
    this.toggleCarouselRotation = this.toggleCarouselRotation.bind(this);
    this.clickOnTabHandler = this.clickOnTabHandler.bind(this);

    this.getCarouselElements();

    this.carouselRotationHandler();
    this.handleElementsOnFocus();
    this.setToggleCarouselRotationHandler();
    this.setClickOnTabHandler();
  }

  // Get carousel elements
  getCarouselElements() {
    this.mainContainer = query(`#${this.carouselId}`);
    this.toggleRotationBtn = query(".carousel__rotation", this.mainContainer);
    this.toggleRotationIcon = query("use", this.toggleRotationBtn);
    this.carouselImage = query(".carousel__content-img", this.mainContainer);
    this.tabsContainer = query(".carousel__tabs", this.mainContainer);
    this.tabsElements = [
      ...queryAll(".carousel__tabs-tab", this.tabsContainer),
    ];
  }

  // Handlers
  carouselRotationHandler() {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      this.initialRender
    ) {
      this.initialRender = false;
      return;
    }

    const rotationInterval = setInterval(() => {
      // Queries for active tab and index of current active tag
      const activeTab = query(".--active", this.tabsContainer);
      const indexActiveTab = this.tabsElements.indexOf(activeTab);
      let nextActiveTab;
      let nextActiveTabChild;

      if (indexActiveTab === this.tabsElements.length - 1) {
        nextActiveTab = this.tabsElements[0];
      } else {
        nextActiveTab = this.tabsElements[indexActiveTab + 1];
      }

      nextActiveTabChild = query(".carousel__tabs-image", nextActiveTab);

      // Toggles aria-selected values.
      activeTab.setAttribute("aria-selected", "false");
      nextActiveTab.setAttribute("aria-selected", "true");

      // Removes and adds active class. Defines main container background image
      activeTab.classList.remove("--active");
      nextActiveTab.classList.add("--active");
      this.carouselImage.src = nextActiveTabChild.src;
    }, 3500);

    // Variable added this way because the dom creates a variable on itself with all the ids on document
    window[`_${this.carouselId}`] = rotationInterval;
  }

  stopCarouselRotation() {
    clearInterval(window[`_${this.carouselId}`]);
    delete window[`_${this.carouselId}`];
  }

  toggleCarouselRotation() {
    if (!window[`_${this.carouselId}`]) {
      this.carouselRotationHandler();
      this.toggleRotationIcon.setAttribute(
        "href",
        "/src/assets/icons/icons-sprite.svg#player-pause"
      );
    } else {
      this.stopCarouselRotation(`_${this.carouselId}`);
      this.toggleRotationIcon.setAttribute(
        "href",
        "/src/assets/icons/icons-sprite.svg#player-play"
      );
    }
  }

  handleElementsOnFocus = () => {
    const handleFocusEvent = () => {
      if (window[`_${this.carouselId}`]) {
        this.toggleRotationIcon.setAttribute(
          "href",
          "/src/assets/icons/icons-sprite.svg#player-play"
        );
        this.stopCarouselRotation(`_${this.carouselId}`);
      }
    };

    this.toggleRotationBtn.onfocus = handleFocusEvent;
    this.tabsContainer.onfocus = handleFocusEvent;
    this.tabsElements.forEach(
      (tabElement) => (tabElement.onfocus = handleFocusEvent)
    );
  };

  clickOnTabHandler(tabElement) {
    const currentActiveTab = query(".--active", this.tabsContainer);
    const imageElement = query("img", tabElement);

    // Add/Remove --active class
    tabElement.classList.add("--active");
    currentActiveTab.classList.remove("--active");

    // Add/Remove aria-selected
    tabElement.setAttribute("aria-selected", "true");
    currentActiveTab.setAttribute("aria-selected", "false");
    this.carouselImage.src = imageElement.src;
  }

  // Set handlers
  setToggleCarouselRotationHandler() {
    this.toggleRotationBtn.onclick = this.toggleCarouselRotation;
  }

  setClickOnTabHandler() {
    this.tabsElements.forEach(
      (tabElement) =>
        (tabElement.onclick = () => this.clickOnTabHandler(tabElement))
    );
  }
}
