import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader (element) {
  element.textContent = '';

  // loj trej puntitoj
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....'){
      element.textContent = '';
    }
  }, 100);
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index ++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId (){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
  return (`
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? 'bot' : 'user'}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
  `);
}

async function handleSubmit (e) {
  e.preventDefault(); // el comportamiento default es reload, entonces así nos lo brincamos como tailandeses olímpicos /19/6/23 TG 

  const data = new FormData(form);

  //user's chatstripers
  chatContainer.innerHTML += chatStripe(false, data.get('prompt')); // el false significa que es userinput TG

  form.reset();

  //bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId); // el " " es porque al inicio está vació él de su cabeza porque le vamos a poner los 3 puntos TG

  chatContainer.scrollTop = chatContainer.scrollHeight; // para que se muestre él en su belleza TG

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // fetch data from su servilleta 20/6/23 TG
  const response = await fetch ('http://localhost:5000/', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })

  });

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok){
      const data = await response.json();
      const parseData = data.bot.trim();

      typeText(messageDiv, parseData);
    } else {
      const err = await response.text();

      messageDiv.innerHTML = "something went off the rails!";
      alert("errortz! errortz!");
      console.log(err);
    }

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.key === 'Enter'){
    handleSubmit(e);
  }

})