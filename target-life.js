// target-life.js
AFRAME.registerComponent('target-life', {
  schema: {
    lifetime: { type: 'number', default: 5000 }, // ms
    blinkTime: { type: 'number', default: 1800 } // 消える何ms前から点滅
  },

  init: function () {
    this.startTime = Date.now();
    this.blinking = false;
    this.visible = true;

    // モデルが読み込まれてからマテリアルを取得
    this.el.addEventListener('model-loaded', () => {
      this.meshes = [];
      this.el.object3D.traverse(obj => {
        if (obj.isMesh) {
          this.meshes.push(obj);
        }
      });
    });
  },

  tick: function () {
    const elapsed = Date.now() - this.startTime;
    const remaining = this.data.lifetime - elapsed;

    // 点滅開始
    if (remaining <= this.data.blinkTime && !this.blinking) {
      this.blinking = true;
      this.blinkStart = Date.now();
    }

    // 点滅処理
    if (this.blinking && this.meshes) {
      const t = (Date.now() - this.blinkStart) / 150; // 点滅速度
      const on = Math.floor(t) % 2 === 0;

      this.meshes.forEach(mesh => {
        mesh.visible = true;
        if (mesh.material) {
          mesh.material.color.set(on ? 0x555555 : 0x222222);
        }
      });
    }

    // 完全消滅
    if (elapsed >= this.data.lifetime) {
      if (this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
    }
  }
});
