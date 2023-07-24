class PlacementTile {
    constructor({ position = { x: 0, y: 0 } }) {
      this.position = position
      this.size = 64
    }
  
    draw() {
        c.fillStyle = 'rgba(255, 255, 255, 0.15)';
        c.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
}

class Enemy{
    constructor({position = {x : 0,y : 0}}){
        this.position = position;
        this.width = 80;
        this.height = 80;
        this.waypointIndex = 0;
        this.radius = 50;
        this.center = {
            x: this.position.x + this.width/2,
            y: this.position.y + this.height/2
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.health=100;
        this.image = new Image();
        this.image.src = 'Img/orc.png';
        this.currentframe = 0
        this.elapsedTime=0;
    }

    draw(){
        // // To draw the enemy in earlier stage
        // c.fillStyle = 'Yellow';
        // c.beginPath();
        // c.arc(this.center.x,this.center.y,50,0,Math.PI*2);
        // c.fill();

        // To add the graphics of Enemy.
        const cropWidth = this.image.width/7;
        const crop = {
            position: {
                x: cropWidth*this.currentframe,
                y: 0
            },
            width: cropWidth,
            height: this.image.height
        }

        c.drawImage(
            this.image,
            crop.position.x,
            crop.position.y,
            crop.width,
            crop.height,
            this.position.x,
            this.position.y,
            crop.width,
            crop.height
        );
        if(this.elapsedTime%5===0){
            this.currentframe=(this.currentframe+1)%7;
        }
        this.elapsedTime++;

        // To draw the health bar of enemy.

        c.fillStyle = 'Red';
        c.fillRect(this.position.x,this.position.y-27,this.width,10);

        c.fillStyle = 'Green';
        c.fillRect(this.position.x,this.position.y-27,this.width*(this.health)/100,10);
    }

    update(){
        this.draw();
        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        const speed = 1;

        this.velocity.x = Math.cos(angle) * speed;
        this.velocity.y = Math.sin(angle) * speed;
    
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.center = {
            x: this.position.x + this.width/2,
            y: this.position.y + this.height/2
        }

        if(Math.abs(Math.round(this.center.x) - Math.round(waypoint.x))<Math.abs(this.velocity.x) && Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) && this.waypointIndex < waypoints.length - 1){
            this.waypointIndex++;
        }
    }
}

class Projectile{
    constructor({ position = { x: 0, y: 0 },enemy}) {
      this.velocity = {
        x: 0,
        y: 0
      }
      this.enemy = enemy
      this.position = position;
      this.radius = 10
      this.image = new Image();
      this.image.src = 'Img/projectile.png'
    }

    draw(){
        // To Draw Grapically
        // c.beginPath();
        // c.arc(this.position.x,this.position.y,10,0,Math.PI*2);
        // c.fillStyle = 'orange';
        // c.fill();


        // To make the Image
        c.drawImage(this.image,this.position.x,this.position.y);
    }
  
    update() {
      this.draw()
  
      const angle = Math.atan2(
        this.enemy.center.y - this.position.y,
        this.enemy.center.x - this.position.x
      )
  
      const power = 5;
      this.velocity.x = Math.cos(angle) * power;
      this.velocity.y = Math.sin(angle) * power;
  
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
}

class Building{
    constructor({position = {x: 0,y: 0}}){
        this.position = position;
        this.center = {
            x: this.position.x+64,
            y: this.position.y+32
        }
        this.projectiles = []
        this.radius = 250;
        this.target;
        this.frames=0;
        this.image = new Image();
        this.image.src = 'Img/tower.png';
        this.currentframe = 0
        this.elapsedTime=0;
    }

    draw(){
        // To draw the building initially with colors
        // c.fillStyle = 'blue';
        // c.fillRect(this.position.x,this.position.y,128,64);
        // Now to show the range
        // c.beginPath();
        // c.arc(this.center.x,this.center.y,this.radius,0,Math.PI*2);
        // c.fillStyle = 'rgb(0,0,255,0.2)';
        // c.fill();

        // To draw with images
        const cropWidth = this.image.width/19;
        const crop = {
            position: {
                x: cropWidth*this.currentframe,
                y: 0
            },
            width: cropWidth,
            height: this.image.height
        }

        c.drawImage(
            this.image,
            crop.position.x,
            crop.position.y,
            crop.width,
            crop.height,
            this.position.x,
            this.position.y-80,
            crop.width,
            crop.height
        );
        if(this.elapsedTime%5===0){
            this.currentframe=(this.currentframe+1)%19;
        }
        this.elapsedTime++;
    }

    update2(){
        // To shoot the enemy continuously
        this.draw();
        if(this.frames%100===0 && this.target){
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },enemy: this.target
                })
            )
        }
        this.frames++;

    }

    update({position = {x: 0,y: 0}}){
        // c.clearRect(this.position.x,this.position.y,128,64);
        this.position = position;
        this.center = {
            x: this.position.x+64,
            y: this.position.y+32
        }
        // c.fillStyle = 'blue';
        // c.fillRect(this.position.x,this.position.y,128,64);
        // Here we doesnot draw as draw is done by recursion function that is running in index.js.

        this.projectiles.forEach((element)=>{
            element.position = {x: this.center.x,y: this.center.y}
            element.update();
        });

    }
}

