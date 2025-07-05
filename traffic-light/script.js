(() => {
  const [$redHorizontal, $yellowHorizontal, $greenHorizontal] = [
    ...document.querySelectorAll(".traffic-light__horizontal .light"),
  ];
  const [$redVertical, $yellowVertical, $greenVertical] = [
    ...document.querySelectorAll(".traffic-light__vertical .light"),
  ];
  if (
    !$redHorizontal ||
    !$yellowHorizontal ||
    !$greenHorizontal ||
    !$redVertical ||
    !$yellowVertical ||
    !$greenVertical
  ) {
    return;
  }
  const LIGHT_DURATIONS = {
    RED: 4000,
    YELLOW: 500,
    GREEN: 3000,
  };

  const LIGHT_COLORS = {
    RED: "red",
    YELLOW: "yellow",
    GREEN: "green",
  };

  const toggleLights = (light, color, action) => {
    action === "on"
      ? light.classList.add(color)
      : light.classList.remove(color);
  };

  const turnOnGreen = (direction) => {
    toggleLights(
      direction === "horizontal" ? $greenHorizontal : $greenVertical,
      LIGHT_COLORS.GREEN,
      "on"
    );
    toggleLights(
      direction === "horizontal" ? $yellowHorizontal : $yellowVertical,
      LIGHT_COLORS.YELLOW,
      "off"
    );
    toggleLights(
      direction === "horizontal" ? $redHorizontal : $redVertical,
      LIGHT_COLORS.RED,
      "off"
    );
  };

  const turnOnYellow = (direction) => {
    toggleLights(
      direction === "horizontal" ? $greenHorizontal : $greenVertical,
      LIGHT_COLORS.GREEN,
      "off"
    );
    toggleLights(
      direction === "horizontal" ? $yellowHorizontal : $yellowVertical,
      LIGHT_COLORS.YELLOW,
      "on"
    );
  };

  const turnOnRed = (direction) => {
    toggleLights(
      direction === "horizontal" ? $yellowHorizontal : $yellowVertical,
      LIGHT_COLORS.YELLOW,
      "off"
    );
    toggleLights(
      direction === "horizontal" ? $redHorizontal : $redVertical,
      LIGHT_COLORS.RED,
      "on"
    );
  };

  const startSequence = () => {
    turnOnGreen("horizontal");
    turnOnGreen("vertical");

    setTimeout(() => {
      turnOnYellow("horizontal");
      turnOnYellow("vertical");

      setTimeout(() => {
        turnOnRed("horizontal");
        turnOnRed("vertical");

        setTimeout(startSequence, LIGHT_DURATIONS.RED);
      }, LIGHT_DURATIONS.YELLOW);
    }, LIGHT_DURATIONS.GREEN);
  };

  startSequence();
})();
