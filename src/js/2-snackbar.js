// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

document.querySelector('.form').addEventListener('submit', function (event) {
  event.preventDefault();

  const delayInput = document.querySelector('input[name="delay"]');
  const stateInput = document.querySelector('input[name="state"]:checked');
  const delay = parseInt(delayInput.value);

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (stateInput.value === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(value => {
      iziToast.success({
        title: 'Success',
        message: `Promise fulfilled after ${value}ms`,
      });
    })
    .catch(value => {
      iziToast.error({
        title: 'Error',
        message: `Rejected promise in ${value}ms`,
      });
    });
  delayInput.value = '';
  stateInput.checked = false;
});
