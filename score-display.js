// score-display.js
AFRAME.registerComponent('score-display', {
  schema: {
    hudSelector: { type: 'string', default: '#scoreHud' }
  },

  init: function () {
    this.hud = document.querySelector(this.data.hudSelector);
    this._onScoreUpdated = (ev) => {
      const detail = ev.detail || {};
      const s = detail.score || 0;
      if (this.hud) {
        // a-entity の text 属性を更新（msdf を使っている想定）
        this.hud.setAttribute('text', 'value', `score: ${s}`);
      }
    };
    document.addEventListener('score-updated', this._onScoreUpdated);

    // 初期表示
    if (this.hud) this.hud.setAttribute('text', 'value', `score: 0`);
  },

  remove: function () {
    document.removeEventListener('score-updated', this._onScoreUpdated);
  }
});
