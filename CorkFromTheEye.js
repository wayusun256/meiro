// CorkFromTheEye.js
import { maxCorks } from "./config.js"; // 残弾数設定

window.canShoot = true;

AFRAME.registerComponent('cork-shooter', {
  schema: {
    speed: { type: 'number', default: 0.5 },
    maxDistance: { type: 'number', default: 20 }
  },

  init: function () {
    this.corks = [];
    this.remaining = maxCorks;
    this.cameraEl = this.el;

    // HUD参照
    this.hudEntity = document.querySelector('#ammoHud');
    if (this.hudEntity) {
      this.hudEntity.setAttribute('text', 'value', `AMMO: ${this.remaining}`);
    }

    // スペースキーでコルク発射
    this._onKeyDown = (e) => { if (e.code === 'Space') this.shootCork(); };
    window.addEventListener('keydown', this._onKeyDown);
  },

  shootCork: function () {
    if (this.remaining <= 0) return;
    if(!window.canShoot) return;//時間切れで発射不可

    const cork = document.createElement('a-entity');
    cork.setAttribute('gltf-model', '#cork');
    cork.setAttribute('scale', '0.2 0.2 0.2');

    // 発射位置・方向
    const startPos = new THREE.Vector3();
    const direction = new THREE.Vector3(0, 0, -1);
    this.cameraEl.object3D.getWorldPosition(startPos);
    direction.applyQuaternion(this.cameraEl.object3D.quaternion);
    startPos.add(direction.clone().multiplyScalar(0.5));
    cork.setAttribute('position', startPos);

    cork.userData = {
      startPos: startPos.clone(),
      direction: direction.clone()
    };

    this.el.sceneEl.appendChild(cork);
    this.corks.push(cork);

    // 残弾数更新
    this.remaining--;
    if (this.hudEntity) {
      this.hudEntity.setAttribute('text', 'value', `AMMO: ${this.remaining}`);
    }
  },

  tick: function () {
    const removeList = [];

    this.corks.forEach((cork) => {
      // コルク移動
      const move = cork.userData.direction.clone().multiplyScalar(this.data.speed);
      cork.object3D.position.add(move);

      // 最大距離チェック
      const traveled = cork.object3D.position.distanceTo(cork.userData.startPos);
      if (traveled > this.data.maxDistance) removeList.push(cork);

      // 当たり判定（ターゲットの見た目サイズを考慮）
      const targets = document.querySelectorAll('.target');
      targets.forEach(target => {
        const targetPos = target.object3D.position;
        const bbox = new THREE.Box3().setFromObject(target.object3D);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const radius = Math.max(size.x, size.y, size.z) * 1.5 ;

        if (cork.object3D.position.distanceTo(targetPos) < radius) {
          // スコア加算
          const scoreManager = document.querySelector('#scoreManager');
          scoreManager.emit('addScore', { value: 10 });

          // ターゲット削除
          if (target.parentNode) target.parentNode.removeChild(target);

          // コルク削除
          removeList.push(cork);
        }
      });
    });

    // コルク削除
    removeList.forEach((cork) => {
      if (cork.parentNode) cork.parentNode.removeChild(cork);
      const idx = this.corks.indexOf(cork);
      if (idx !== -1) this.corks.splice(idx, 1);
    });
  },

  remove: function () {
    try {
      window.removeEventListener('keydown', this._onKeyDown);
    } catch (e) { /* ignore */ }
  }
});
