import { query, queryAll } from "./dom";

export class Carousel {
  constructor(carouseldId) {
    this.carouselId = carouseldId;
    this.initialRender = true;
    this.userInteracted = false;
    this.mainContainer;
    this.carouselContent;
    this.tabPanelItems;
    this.carouselImage;
    this.toggleRotationBtn;
    this.toggleRotationIcon;
    this.tabsContainer;
    this.tabsElements;

    // Bindings
    this.toggleCarouselRotationHandler =
      this.toggleCarouselRotationHandler.bind(this);
    this.clickOnTabHandler = this.clickOnTabHandler.bind(this);
    this.keyboardControlsHandler = this.keyboardControlsHandler.bind(this);
    this.stopCarouselRotationHandler =
      this.stopCarouselRotationHandler.bind(this);
    this.carouselRotationHandler = this.carouselRotationHandler.bind(this);
    this.carouselMouseOutHandler = this.carouselMouseOutHandler.bind(this);

    // Select carousel elements
    this.getCarouselElements();

    // Setting event listeners
    this.carouselRotationHandler();
    this.setElementsOnFocusHandler();
    this.settoggleCarouselRotationHandler();
    this.setClickOnTabHandler();
    this.setKeyboardControlsHandler();
    this.setHoveringCarouselHandler();
  }

  // Get carousel elements
  getCarouselElements() {
    this.mainContainer = query(`#${this.carouselId}`);
    this.carouselContent = query(".carousel__content", this.mainContainer);
    this.tabPanelItems = [
      ...queryAll(".carousel__content-tabpanel", this.mainContainer),
    ];
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
      const activeTabPanel = query(".--active", this.carouselContent);
      let nextActiveTabPanel;
      let nextActiveTab;

      if (indexActiveTab === this.tabsElements.length - 1) {
        nextActiveTabPanel = this.tabPanelItems[0];
        nextActiveTab = this.tabsElements[0];
      } else {
        nextActiveTabPanel = this.tabPanelItems[indexActiveTab + 1];
        nextActiveTab = this.tabsElements[indexActiveTab + 1];
      }

      // Toggles aria-selected values.
      activeTab.setAttribute("aria-selected", "false");
      nextActiveTab.setAttribute("aria-selected", "true");

      // Removes and adds active class. Defines main container background image
      activeTab.classList.remove("--active");
      nextActiveTab.classList.add("--active");
      activeTabPanel.classList.remove("--active");
      nextActiveTabPanel.classList.add("--active");
    }, 3500);

    // Variable added this way because the dom creates a variable on itself with all the ids on document
    window[`_${this.carouselId}`] = rotationInterval;
  }

  stopCarouselRotationHandler() {
    this.toggleRotationIcon.setAttribute(
      "href",
      "/src/assets/icons/icons-sprite.svg#player-play"
    );
    this.toggleRotationBtn.setAttribute(
      "aria-label",
      "Iniciar rotación automatica"
    );
    this.carouselContent.setAttribute("aria-live", "polite");
    clearInterval(window[`_${this.carouselId}`]);
    delete window[`_${this.carouselId}`];
  }

  toggleCarouselRotationHandler() {
    if (!window[`_${this.carouselId}`]) {
      this.carouselRotationHandler();
      this.toggleRotationBtn.setAttribute(
        "aria-label",
        "Detener rotación automatica"
      );
      this.carouselContent.setAttribute("aria-live", "off");
      this.toggleRotationIcon.setAttribute(
        "href",
        "/src/assets/icons/icons-sprite.svg#player-pause"
      );
    } else {
      this.stopCarouselRotationHandler(`_${this.carouselId}`);
    }
  }

  clickOnTabHandler(tabElement) {
    const currentActiveTab = query(".--active", this.tabsContainer);
    const activeTabPanel = query(".--active", this.carouselContent);
    const nextActiveTabPanel = this.tabPanelItems[tabElement.dataset.position];

    if (currentActiveTab === tabElement) return;

    // Add/Remove --active class
    tabElement.classList.add("--active");
    currentActiveTab.classList.remove("--active");
    activeTabPanel.classList.remove("--active");
    nextActiveTabPanel.classList.add("--active");

    // Add/Remove aria-selected
    tabElement.setAttribute("aria-selected", "true");
    currentActiveTab.setAttribute("aria-selected", "false");
  }

  keyboardControlsHandler(event) {
    const { key } = event;

    if (
      [
        "ArrowRight",
        "ArrowLeft",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(key)
    ) {
      event.preventDefault();
      const activeTab = query(".--active", this.tabsContainer);
      const indexActiveTab = this.tabsElements.indexOf(activeTab);
      const tabsElementsLenght = this.tabsElements.length - 1;
      const activeTabPanel = query(".--active", this.carouselContent);
      let nextActiveTabPanel;
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
      } else {
        return;
      }

      newActiveTab = this.tabsElements[newActiveTabPosition];
      nextActiveTabPanel = this.tabPanelItems[newActiveTabPosition];

      if (newActiveTab === activeTab) return;

      // Add/Remove --active class
      newActiveTab.classList.add("--active");
      activeTab.classList.remove("--active");
      nextActiveTabPanel.classList.add("--active");
      activeTabPanel.classList.remove("--active");

      // Add/Remove aria-selected
      newActiveTab.setAttribute("aria-selected", "true");
      activeTab.setAttribute("aria-selected", "false");

      newActiveTab.focus();
    }
  }

  carouselMouseOutHandler() {
    this.carouselRotationHandler();
    this.toggleRotationIcon.setAttribute(
      "href",
      "/src/assets/icons/icons-sprite.svg#player-pause"
    );
  }

  // Set handlers
  settoggleCarouselRotationHandler() {
    this.toggleRotationBtn.onclick = this.toggleCarouselRotationHandler;
  }

  setElementsOnFocusHandler = () => {
    const handleFocusEvent = () => {
      this.userInteracted = true;
      this.mainContainer.removeEventListener(
        "mouseover",
        this.stopCarouselRotationHandler
      );
      this.mainContainer.removeEventListener(
        "mouseout",
        this.carouselMouseOutHandler
      );

      if (window[`_${this.carouselId}`]) {
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

  setHoveringCarouselHandler() {
    this.mainContainer.addEventListener(
      "mouseover",
      this.stopCarouselRotationHandler
    );
    this.mainContainer.addEventListener(
      "mouseout",
      this.carouselMouseOutHandler
    );
  }
}
