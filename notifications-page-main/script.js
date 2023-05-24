import { SingleMessage } from './components/SingleMessage.js';
import { SingleMessageAvatar } from './components/SingleMessageAvatar.js';

const markAllBtn = document.querySelector('.btn-mark');
const count = document.querySelector('.count');
const newMessages = [...document.querySelectorAll('.new')];
const unreadIndicators = [...document.querySelectorAll('.unread')];

markAllBtn.addEventListener('click', () => {
  newMessages.forEach(message => message.classList.remove('new'));
  unreadIndicators.forEach(indicator => indicator.remove());
  count.innerText = 0;
});

newMessages.forEach(message => {
  message.addEventListener('click', e => {
    message.classList.remove('new');
    count.innerText--;
  });
});
