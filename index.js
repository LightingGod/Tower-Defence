let biggerarea = document.getElementsByClassName('photodisplay')[0];
let smallerblocks = document.getElementsByClassName('gameSS');
let i = 0;

// Making the code for animated cover appearence and link path
{/* <a href="./Game-TowerDefence/index.html"> */}
let mybutton = document.getElementById('mainbutton');
let block1 = document.getElementById('backgroundComer-1');
let block2 = document.getElementById('backgroundComer-2');

let inter = setInterval(() => {
    i=(i+1)%3;
    smallerblocks[(i-1+3)%3].classList.remove('active');
    smallerblocks[i].classList.add('active');
    biggerarea.style.backgroundImage = smallerblocks[i].style.backgroundImage;
}, 4000);


mybutton.addEventListener("click",()=>{
    block1.style.display = "block";
    block2.style.display = "block";

    setTimeout(() => {
        location.href = `./Game-TowerDefence/Level-2.html`;
    }, 2300);
})
