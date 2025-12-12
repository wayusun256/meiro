AFRAME.registerComponent("target-spawner", {
  schema: {
    center: { type: "vec3" },
    radiusMin: { type: "number", default: 5 },
    radiusMax: { type: "number", default: 15 },
    heightMin: { type: "number", default: 48 },
    heightMax: { type: "number", default: 53 },
  },

  init: function () {
    this.startTime = null; // カウントダウン開始時刻
    this.intervalId = null;
  },

  spawnTargets: function () {
    const scene = this.el.sceneEl;
    const cfg = this.data;
    const center = cfg.center;

    this.startTime = Date.now();
    
    this.intervalId = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000; // 経過秒
      let numPerSec = 4;

      if (elapsed >= 45) numPerSec = 10;
      else if (elapsed >= 30) numPerSec = 8;
      else if (elapsed >= 15) numPerSec = 6;
      else numPerSec = 4;

      for (let i = 0; i < numPerSec; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = cfg.radiusMin + Math.random() * (cfg.radiusMax - cfg.radiusMin);
        const x = center.x + Math.cos(angle) * radius;
        const z = center.z + Math.sin(angle) * radius;
        const y = cfg.heightMin + Math.random() * (cfg.heightMax - cfg.heightMin);

        const target = document.createElement("a-entity");
        target.setAttribute("gltf-model", "#mato");
        target.setAttribute("class", "target");
        target.setAttribute("position", `${x} ${y} ${z}`);
        target.setAttribute("target-hit", "threshold: 0.5");

        // 中心方向に向かせる
        target.addEventListener("model-loaded", () => {
          target.object3D.lookAt(new THREE.Vector3(center.x, center.y, center.z));
        });

        // 出現後5秒で削除
        setTimeout(() => {
          if (target.parentNode) target.parentNode.removeChild(target);
        }, 5000);

        scene.appendChild(target);
      }

      // 60秒で停止
      if (elapsed >= 60) {
        clearInterval(this.intervalId);
      }
    }, 1000); // 1秒ごとに実行
  }
});
