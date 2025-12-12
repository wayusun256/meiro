AFRAME.registerComponent("score-manager", {
  init: function () {
    this.score = 0;

    this.el.addEventListener("addScore", (evt) => {
      this.score += evt.detail.value;

      const hud = document.querySelector("#scoreHud");
      hud.setAttribute("text", "value: score: " + this.score);
    });
  }
});
