const canvas = document.getElementById('mygraphicsarea');
const c = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);




const placementTilesData2D = [];

for (let i = 0; i < placementTilesData.length; i += 20) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 20)); //Used to datect where we can put the defence tower.
}

const placementTiles = [];

placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 14) {
      // add building placement tile here
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 64,
            y: y * 64
          }
        })
      )
    }
  })
})



const image = new Image();   //It is used to convert the current image into html image.

image.onload = () => {
  enemymover();
}
image.src = 'Img/Level-5.png';



const enemies = [];
function makeenemywaves(number) {
  for (let i = 1; i < number + 1; i++) {
    const offset = i * 150;
    enemies.push(
      new Enemy({ position: { x: waypoints[0].x - offset, y: waypoints[0].y } })
    );
  }
}
makeenemywaves(20);



const buildings = [];
buildings.push(
  new Building({ position: { x: 64, y: 32 } })
);
buildings.push(
  new Building({ position: { x: 192, y: 32 } })
);
buildings.push(
  new Building({ position: { x: 64, y: 704 } })
);
buildings.push(
  new Building({ position: { x: 192, y: 704 } })
);

let flag = 0;

function enemymover() {
  const animationid = requestAnimationFrame(enemymover);
  c.drawImage(image, 0, 0);

  if (flag === 1) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.update();
    }
  }

  // Drawing the flexbox area
  c.fillStyle = "rgb(255,255,255,0.18)";
  c.fillRect(60, 0, 1280, 192);
  c.fillRect(60,576,1280,192);

  buildings.forEach((building) => {
    building.update2();
    building.target = null;
    // to find the first enemny in the range.
    const validEnemies = enemies.filter(enemy => {
      const xDifference = enemy.center.x - building.center.x
      const yDifference = enemy.center.y - building.center.y
      const distance = Math.hypot(xDifference, yDifference)
      return distance < enemy.radius + building.radius
    });
    building.target = validEnemies[0];

    // To shoot the enemy and then remove the graphic as soon as it hit the enemey.
    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i]
      projectile.update();
      const xDifference = projectile.enemy.center.x - projectile.position.x;
      const yDifference = projectile.enemy.center.y - projectile.position.y;
      const distance = Math.hypot(xDifference, yDifference);
      if (distance < projectile.enemy.radius + projectile.radius) {
        // The ball has collision with the enemy and now health of enemy decreses and if health of any enemny become zero then we have to remove it from squad.
        projectile.enemy.health -= 20;
        if (projectile.enemy.health <= 0) {
          const idx = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy
          })

          if (idx > -1) {
            enemies.splice(idx, 1);
          }
        }

        // For Game successfull submission
        if (enemies.length === 0) {
          document.getElementById('gamecomplete').style.display='block';
        }


        building.projectiles.splice(i, 1)
      }
    }
  })

  if (enemies.length > 0 && enemies[0].center.x >= 1280) {
    console.log('Game Over');
    cancelAnimationFrame(animationid);
    document.getElementById('gameover').style.display = 'block';
  }
}

// Making the form submission
document.getElementById('Submit').addEventListener('click', () => {
  flag = 1;
  let area1 = document.getElementById('codearea1');
  let area2 = document.getElementById('codearea2');
  let area3 = document.getElementById('codearea3');
  let area4 = document.getElementById('codearea4');
  let s1 = area1.value;
  let s2 = area2.value;
  let s3 = area3.value;
  let s4 = area4.value;
  s1 = s1.replaceAll(' ', '');
  s2 = s2.replaceAll(' ', '');
  s3 = s3.replaceAll(' ', '');
  s4 = s4.replaceAll(' ', '');

  if (s1.slice(16) === 'flex-end') {
    buildings[0].update({ position: { x: 1024, y: buildings[0].position.y } });
    buildings[1].update({ position: { x: 1152, y: buildings[1].position.y } });
  }
  else if (s1.slice(16) == 'flex-start') {
    buildings[0].update({ position: { x: 64, y: buildings[0].position.y } });
    buildings[1].update({ position: { x: 192, y: buildings[1].position.y } });
  }
  else if (s1.slice(16) == 'center') {
    buildings[0].update({ position: { x: 512, y: buildings[0].position.y } });
    buildings[1].update({ position: { x: 640, y: buildings[1].position.y } });
  }
  else if (s1.slice(16) == 'space-between') {
    buildings[0].update({ position: { x: 64, y: buildings[0].position.y } });
    buildings[1].update({ position: { x: 1152, y: buildings[1].position.y } });
  }


  if (s2.slice(12) === 'flex-end') {
    buildings[0].update({ position: { x: buildings[0].position.x, y: 128 } });
    buildings[1].update({ position: { x: buildings[1].position.x, y: 128 } });
  }
  else if (s2.slice(12) == 'flex-start') {
    buildings[0].update({ position: { x: buildings[0].position.x, y: 32 } });
    buildings[1].update({ position: { x: buildings[1].position.x, y: 32 } });

  }



  if (s3.slice(16) === 'flex-end') {
    buildings[2].update({ position: { x: 1024, y: buildings[2].position.y } });
    buildings[3].update({ position: { x: 1152, y: buildings[3].position.y } });
  }
  else if (s3.slice(16) == 'flex-start') {
    buildings[2].update({ position: { x: 64, y: buildings[2].position.y } });
    buildings[3].update({ position: { x: 192, y: buildings[3].position.y } });
  }
  else if (s3.slice(16) == 'center') {
    buildings[2].update({ position: { x: 512, y: buildings[2].position.y } });
    buildings[3].update({ position: { x: 640, y: buildings[3].position.y } });
  }
  else if (s3.slice(16) == 'space-between') {
    buildings[2].update({ position: { x: 64, y: buildings[2].position.y } });
    buildings[3].update({ position: { x: 1152, y: buildings[3].position.y } });
  }


  if (s4.slice(11) === 'flex-end') {
    buildings[2].update({ position: { x: buildings[2].position.x, y: 128 } });
    buildings[3].update({ position: { x: buildings[3].position.x, y: 128 } });
  }
  else if (s4.slice(11) == 'flex-start') {
    buildings[2].update({ position: { x: buildings[2].position.x, y: 32 } });
    buildings[3].update({ position: { x: buildings[3].position.x, y: 32 } });
  }
})
