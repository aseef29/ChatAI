import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector("form");
const chatContainer = document.querySelector ("#chat_container");

let loadIntervel;


function loader(element){
  element.textContent = '...';
  loadIntervel = setInterval(() => {
    element.textContent += '.';
    if (element.textContent === '....') {
      element.textContent += '';
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length){
      element.innerHtml += text.charAt(index);
      index += 1;
    } else {
      clearInterval(interval);
    }
  },20)
}

function generateUniqueId(){
  const timestamp = date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}


function chartStripe (isAi, value, uniqueId){
  return(
    `
    <div class = "wrapper ${isAi && 'ai'}">
    <div class = "chat">
    <div class= "profile">
    <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
      </div>
      <div class = "message" id ="${uniqueId}>${value}</div>
    </div>
  </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();  

  const data = new FormData(form);
  // user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.rest();
  // bot's chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ",uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch date from server

  const response = await fetch ('https://chatai.onrender.com ',{
    method: 'post',
    header:{
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      prompt:data.get('prompt')
    })
  })
}

clearInterval(loadIntervel);
messageDiv.innerHTML = '';

if(response.ok){
  const data = await response.JSON();
  const parseData = data.bot.trim();

  typeText(messageDiv, parseData);
} else{
  const err = await response.text();
  messageDiv.innerHTML = " something went wrong";

  alert(err);
}

form . addEventListener('submit', handleSubmit);
form . addEventListener('keyUp', (e) => {
  if (e.keyCode === 13){
    handleSubmit(e);
  }
});

