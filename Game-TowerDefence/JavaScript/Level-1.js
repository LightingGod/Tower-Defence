const canvas = document.getElementById('mygraphicsarea');
const c = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();   //It is used to convert the current image into html image.
image.onload = ()=>{         //If not used this then image will not appear as image is loading in javascript after this line of code runs.
    enemymover();
}
image.src = 'Img/GameMap.png';

const enemies = [];


const buildings = [];
buildings.push(
    new Building({position: {x: 0,y:192}})
);

buildings.push(
    new Building({position: {x: 0,y:256}})
);
buildings.push(
    new Building({position: {x: 0,y:512}})
);

let flag=0;

function enemymover(){
    const animationid = requestAnimationFrame(enemymover);
    c.drawImage(image,0,0);

    if(flag===1){
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            enemy.update();
        }
    }

    c.fillStyle = "rgb(255,255,255,0.18)";
    c.fillRect(0, 192, 1280, 64);
    c.fillRect(0, 256, 1280, 74);
    c.fillRect(0, 512, 1280, 74);

    buildings.forEach((building)=>{
        building.update2();
        building.target = null;
        // to find the first enemny in the range.
        const validEnemies = enemies.filter(enemy=>{
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
            if(distance < projectile.enemy.radius + projectile.radius) {
                // The ball has collision with the enemy and now health of enemy decreses and if health of any enemny become zero then we have to remove it from squad.
                projectile.enemy.health -= 20;
                if(projectile.enemy.health<= 0){
                    const idx = enemies.findIndex((enemy)=>{
                        return projectile.enemy === enemy
                    })

                    if(idx > -1){
                        enemies.splice(idx,1);
                    }
                }

                if(enemies.length===0){
                    document.getElementById('gamecomplete').style.display='block';
                    setTimeout(() => {
                        window.location.href="./Level-2.html";
                    }, 3000);
                }
                building.projectiles.splice(i, 1)
            }
        }
    })

    if(enemies.length>0 && enemies[0].center.x>=1280){
        console.log('Game Over');
        cancelAnimationFrame(animationid);
        document.getElementById('gameover').style.display = 'block';
    }
}

document.getElementById('Submit').addEventListener('click',(e,err)=>{
    flag=1;
    function makeenemywaves(number){
        for(let i = 1;i<number+1;i++){
            const offset = i*150;
            enemies.push(
                new Enemy({position: {x : waypoints[0].x -offset, y: waypoints[0].y}})
            );
        }
    }
    makeenemywaves(10);
    let area1 = document.getElementById('codearea1');
    let area2 = document.getElementById('codearea2');
    let area3 = document.getElementById('codearea3');
    let s1 = area1.value;
    let s2 = area2.value;
    let s3 = area3.value;
    s1 = s1.replaceAll(' ', '');        
    s2 = s2.replaceAll(' ', '');      
    s3 = s3.replaceAll(' ', '');        
    
    buildings[0].update({position: {x: 384,y: 192}});
    
    if(s2.slice(16)==="flex-end"){
        buildings[1].update({position: {x: 1152,y: 256}});
    }
    else if(s2.slice(16)==="center"){
        // No movement as not a valid move.
        console.log("Not a valid Move");
    }
    else if(s2.slice(16)==="flex-start"){
        buildings[1].update({position: {x: 0,y: 256}});
    }

    if(s3.slice(16)=="flex-end"){
        buildings[2].update({position: {x: 1152,y: 512}});    
    }
    else if(s3.slice(16)=="center"){
        buildings[2].update({position: {x: 576,y: 512}});
    }
    else if(s3.slice(16)=="flex-start"){
        buildings[2].update({position: {x: 0,y: 512}});
    }     
})

document.getElementById('seperatebtn').addEventListener('click',()=>{
    document.getElementById('informations').style.display='none';
})

