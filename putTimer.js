//アイテムを迷路内に配置する関数 
export function putTimer(x,y,modelId) { 
    const scene = document.querySelector('#maze'); 
    const item = document.createElement('a-entity'); 

    //以下3行crateKabeと同じ変数 
    //これで壁とアイテムは両方中心に座標がおかれる 
    const cellSize = 2; 
    const centerX = x * cellSize + cellSize / 2; // = x*2 + 1 
    const centerZ = y * cellSize + cellSize / 2; // = y*2 + 1 

    item.setAttribute("gltf-model",modelId); 
    item.setAttribute("position",`${centerX} 1.2 ${centerZ}`);//アイテムの中心の座標を壁の中心座標と合わせておく 
    item.setAttribute('rotation', '0 90 0');//向きを正面にするが、あとで回転するようにする 
    item.setAttribute('scale', '0.25 0.25 0.25');//大きさ調整 

    //setAttribute は、A-Frameのエンティティにコンポーネントを追加する方法です。 
    //"distance-check" をセットすることで、アイテムが 距離チェックのコンポーネント を持つことになります。 
    item.setAttribute("distance-check", "range", 0.5);//アイテムと自分との距離を測るためのコンポーネントを追加 
    console.log(item); // アイテムが作成されたことを確認 
    scene.appendChild(item); 

} 