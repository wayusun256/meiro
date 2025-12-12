AFRAME.registerComponent("target-hit", {
  init: function () {
    this.el.addEventListener("hit", (evt) => {
      // スコアアップイベントをスコアマネージャーへ通知
      const scoreManager = document.querySelector("#scoreManager");
      scoreManager.emit("addScore", { value: 10 });

      // 的を消す
      this.el.parentNode.removeChild(this.el);
    });
  }
});
