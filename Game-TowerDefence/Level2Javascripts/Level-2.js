const canvas = document.getElementById('mygraphicsarea');
const c = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);


const image = new Image();   //It is used to convert the current image into html image.

image.onload = () => {
  enemymover();
}
image.src = 'Img/Level2Map.png';



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
  new Building({ position: { x: 0, y: 384 } })
);
buildings.push(
  new Building({ position: { x: 384, y: 384 } })
);
buildings.push(
  new Building({ position: { x: 768, y: 384 } })
);
buildings.push(
  new Building({ position: { x: 1088, y: 384 } })
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
  c.fillRect(0, 256, 1280, 256);

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
          setTimeout(() => {
              window.location.href="./Level-3.html";
          }, 3000);
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

  if (s1.slice(11) === 'flex-end') {
    buildings[0].update({ position: { x: buildings[0].position.x, y: 448 } });
  }
  else if (s1.slice(11) == 'flex-start') {
    buildings[0].update({ position: { x: buildings[0].position.x, y: 256 } });
  }


  if (s2.slice(11) === 'flex-end') {
    buildings[1].update({ position: { x: buildings[1].position.x, y: 448 } });
  }
  else if (s2.slice(11) == 'flex-start') {
    buildings[1].update({ position: { x: buildings[1].position.x, y: 256 } });
  }


  if (s3.slice(11) === 'flex-end') {
    buildings[2].update({ position: { x: buildings[2].position.x, y: 448 } });
  }
  else if (s3.slice(11) == 'flex-start') {
    buildings[2].update({ position: { x: buildings[2].position.x, y: 256 } });
  }


  if (s4.slice(11) === 'flex-end') {
    buildings[3].update({ position: { x: buildings[3].position.x, y: 448 } });
  }
  else if (s4.slice(11) == 'flex-start') {
    buildings[3].update({ position: { x: buildings[3].position.x, y: 256 } });
  }
})


document.getElementById('seperatebtn').addEventListener('click',()=>{
  document.getElementById('informations').style.display='none';
})