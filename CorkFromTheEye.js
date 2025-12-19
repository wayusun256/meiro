// CorkFromTheEye.js
import { maxCorks } from "./config.js";

window.canShoot = true;

AFRAME.registerComponent('cork-shooter', {
  schema: {
    speed: { type: 'number', default: 0.6 },
    maxDistance: { type: 'number', default: 200 }
  },

  init: function () {
    this.remaining = maxCorks;
    this.cameraEl = this.el;
    this.corks = [];

    this.hudEntity = document.querySelector('#ammoHud');
    this.updateAmmo();

    this._onKeyDown = (e) => {
      if (e.code === 'Space') this.shoot();
    };
    window.addEventListener('keydown', this._onKeyDown);

    // 接続されたコントローラを確認
  this.el.sceneEl.addEventListener('controllerconnected', (e) => {
    console.log('controller connected:', e.detail.name);
  });
 
  // スティック（thumbstick）入力確認
  this.el.addEventListener('thumbstickmoved', (e) => {
    console.log('thumbstick:', e.detail);
  });
 
  // トリガーボタン確認
  this.el.addEventListener('triggerdown', () => {
    console.log('trigger down');
  });
 

  },

  shoot: function () {
    if (this.remaining <= 0) return;
    if (!window.canShoot) return;

    /* =========
       発射位置・方向
    ========= */
    const startPos = new THREE.Vector3();
    const dir = new THREE.Vector3(0, 0, -1);

    this.cameraEl.object3D.getWorldPosition(startPos);
    dir.applyQuaternion(this.cameraEl.object3D.quaternion).normalize();

    /* =========
       Raycaster（命中地点取得）
    ========= */
    const raycaster = new THREE.Raycaster(
      startPos,
      dir,
      0,
      this.data.maxDistance
    );

    const targets = Array.from(document.querySelectorAll('.target'))
      .map(t => t.object3D);

    const hits = raycaster.intersectObjects(targets, true);

    let hitInfo = null;

    if (hits.length > 0) {
      const hit = hits[0];
      const targetEl = hit.object.el.closest('.target');

      if (targetEl) {
        hitInfo = {
          distance: hit.distance,
          point: hit.point.clone(),
          targetEl
        };
      }
    }

    /* =========
      見た目用コルク生成
    ========= */
     const cork = document.createElement('a-entity');
      cork.setAttribute('gltf-model', '#cork');
      cork.setAttribute('scale', '0.2 0.2 0.2');

      cork.object3D.position.copy(
        startPos.clone().add(dir.clone().multiplyScalar(0.4))
      );

      /* ★ 進行方向に向ける ★ */
      const modelForward = new THREE.Vector3(1, 0, 0); // ← cork.glbの前方向
      const quat = new THREE.Quaternion();
      quat.setFromUnitVectors(
        modelForward,
        dir.clone().normalize()
      );
      cork.object3D.quaternion.copy(quat);

      cork.userData = {
        direction: dir.clone(),
        traveled: 0,
        hitInfo
      };

      this.el.sceneEl.appendChild(cork);
      this.corks.push(cork);

    this.remaining--;
    this.updateAmmo();
  },

  tick: function () {
    const removeList = [];

    this.corks.forEach(cork => {
      const move = cork.userData.direction
        .clone()
        .multiplyScalar(this.data.speed);

      cork.object3D.position.add(move);
      cork.userData.traveled += move.length();

      const hitInfo = cork.userData.hitInfo;

      // ===== 命中地点に到達 =====
      if (hitInfo && cork.userData.traveled >= hitInfo.distance) {
        // スコア加算
        document.querySelector('#scoreManager')
          .emit('addScore', { value: 10 });

        // HIT表示
        this.showHitText(hitInfo.point);

        // 的削除
        if (hitInfo.targetEl.parentNode) {
          hitInfo.targetEl.parentNode.removeChild(hitInfo.targetEl);
        }

        removeList.push(cork);
        return;
      }

      // ===== 命中なしで最大距離 =====
      if (!hitInfo && cork.userData.traveled > this.data.maxDistance) {
        removeList.push(cork);
      }
    });

    removeList.forEach(cork => {
      if (cork.parentNode) cork.parentNode.removeChild(cork);
      this.corks.splice(this.corks.indexOf(cork), 1);
    });
  },

  showHitText: function (pos) {
    const text = document.createElement('a-entity');
    text.setAttribute('text', {
      value: 'HIT!',
      color: 'red',
      align: 'center'
    });
    text.setAttribute('position', pos);
    text.setAttribute('scale', '2 2 2');

    this.el.sceneEl.appendChild(text);

    setTimeout(() => {
      if (text.parentNode) text.parentNode.removeChild(text);
    }, 700);
  },

  updateAmmo: function () {
    if (this.hudEntity) {
      this.hudEntity.setAttribute(
        'text',
        'value',
        `AMMO: ${this.remaining}`
      );
    }
  },

  remove: function () {
    window.removeEventListener('keydown', this._onKeyDown);
  }
});
