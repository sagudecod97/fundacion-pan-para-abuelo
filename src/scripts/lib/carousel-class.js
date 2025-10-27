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
    this.toggleCarouselRotationHandler =
      this.toggleCarouselRotationHandler.bind(this);
    this.clickOnTabHandler = this.clickOnTabHandler.bind(this);
    this.keyboardControlsHandler = this.keyboardControlsHandler.bind(this);

    this.getCarouselElements();

    this.carouselRotationHandler();
    this.setElementsOnFocusHandler();
    this.settoggleCarouselRotationHandler();
    this.setClickOnTabHandler();
    this.setKeyboardControlsHandler();
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

  stopCarouselRotationHandler() {
    clearInterval(window[`_${this.carouselId}`]);
    delete window[`_${this.carouselId}`];
  }

  toggleCarouselRotationHandler() {
    if (!window[`_${this.carouselId}`]) {
      this.carouselRotationHandler();
      this.toggleRotationIcon.setAttribute(
        "href",
        "/src/assets/icons/icons-sprite.svg#player-pause"
      );
    } else {
      this.stopCarouselRotationHandler(`_${this.carouselId}`);
      this.toggleRotationIcon.setAttribute(
        "href",
        "/src/assets/icons/icons-sprite.svg#player-play"
      );
    }
  }

  clickOnTabHandler(tabElement) {
    const currentActiveTab = query(".--active", this.tabsContainer);
    const imageElement = query("img", tabElement);

    if (currentActiveTab === tabElement) return;

    // Add/Remove --active class
    tabElement.classList.add("--active");
    currentActiveTab.classList.remove("--active");

    // Add/Remove aria-selected
    tabElement.setAttribute("aria-selected", "true");
    currentActiveTab.setAttribute("aria-selected", "false");
    this.carouselImage.src = imageElement.src;
  }

  keyboardControlsHandler(event) {
    event.preventDefault();
    const { key } = event;

    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) return;

    const activeTab = query(".--active", this.tabsContainer);
    const indexActiveTab = this.tabsElements.indexOf(activeTab);
    const tabsElementsLenght = this.tabsElements.length - 1;
    let newActiveTab;
    let newActiveTabPosition;

    if (key === "ArrowRight") {
      newActiveTabPosition =
        indexActiveTab === tabsElementsLenght ? 0 : indexActiveTab + 1;
    } else if (key === "ArrowLeft") {
      newActiveTabPosition =
        indexActiveTab === 0 ? tabsElementsLenght : indexActiveTab - 1;
    } else if (key === "Home") {
      newActiveTabPosition = 0;
    } else if (key === "End") {
      newActiveTabPosition = tabsElementsLenght;
    }

    newActiveTab = this.tabsElements[newActiveTabPosition];

    if (newActiveTab === activeTab) return;

    const newActiveImageElement = query("img", newActiveTab);

    // Add/Remove --active class
    newActiveTab.classList.add("--active");
    activeTab.classList.remove("--active");

    // Add/Remove aria-selected
    newActiveTab.setAttribute("aria-selected", "true");
    activeTab.setAttribute("aria-selected", "false");
    this.carouselImage.src = newActiveImageElement.src;
  }

  // Set handlers
  settoggleCarouselRotationHandler() {
    this.toggleRotationBtn.onclick = this.toggleCarouselRotationHandler;
  }

  setElementsOnFocusHandler = () => {
    const handleFocusEvent = () => {
      if (window[`_${this.carouselId}`]) {
        this.toggleRotationIcon.setAttribute(
          "href",
          "/src/assets/icons/icons-sprite.svg#player-play"
        );
        this.stopCarouselRotationHandler(`_${this.carouselId}`);
      }
    };

    this.toggleRotationBtn.onfocus = handleFocusEvent;
    this.tabsContainer.onfocus = handleFocusEvent;
    this.tabsElements.forEach(
      (tabElement) => (tabElement.onfocus = handleFocusEvent)
    );
  };

  setClickOnTabHandler() {
    this.tabsElements.forEach(
      (tabElement) =>
        (tabElement.onclick = () => this.clickOnTabHandler(tabElement))
    );
  }

  setKeyboardControlsHandler() {
    this.tabsContainer.addEventListener(
      "keydown",
      this.keyboardControlsHandler
    );
  }
}
