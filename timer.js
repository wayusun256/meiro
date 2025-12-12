// timer.js

export function startTimer() {
  const textEl = document.querySelector('#timerText');

  let time = 60;
  let shoting = false;
  window.shot_time=63;

  textEl.setAttribute("text", `value: ${time}`);

  const interval = setInterval(() => {
    time -= 1;
    textEl.setAttribute("text", `value: ${time}`);

    if (time <= 0 && shoting === false) {
      //clearInterval(interval);
      alert("移動します");
      disableWASD();
      time = shot_time;
      shoting = true;
    } else if(time <= 0 && shoting === true){
      disableAll();
      clearInterval(interval);
      alert("時間切れです！");
    }
  }, 1000);
}

function disableWASD(){
  rig.setAttribute('position', { x: 100, y: 50, z: 100 });
  rig.emit('arrival');
  document.querySelector('#rig').removeAttribute('movement-control');
}

function disableAll(){
  document.querySelector('#camera').removeAttribute('look-controls');
  window.canShoot = false;
}