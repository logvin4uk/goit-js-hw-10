import iziToast from 'izitoast';
import flatpickr from 'flatpickr';

// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для додавання нуля, якщо число менше двох символів
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

let userSelectedDate = null;

// Функція для оновлення інтерфейсу таймера
function updateTimerDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds').textContent = addLeadingZero(seconds);
}

// Функція для старту таймера
function startTimer() {
  const currentDate = new Date();
  const difference = userSelectedDate - currentDate;

  if (difference <= 0) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });

    return;
  }

  // Оновлення інтерфейсу перед початком відліку
  updateTimerDisplay(0);

  // Старт таймера з оновленням кожну секунду
  const intervalId = setInterval(() => {
    const currentDate = new Date();
    const difference = userSelectedDate - currentDate;

    // Оновлення інтерфейсу
    updateTimerDisplay(difference);

    // Перевірка на закінчення таймера
    if (difference <= 0) {
      clearInterval(intervalId);
      iziToast.success({
        title: 'Success',
        message: 'Countdown finished!',
      });

      // Робимо кнопку та поле неактивними після закінчення таймера
      const startButton = document.querySelector('[data-start]');
      const dateTimePicker = document.getElementById('datetime-picker');
      startButton.disabled = true;
      dateTimePicker.disabled = true;

      // Повертаємо поле вводу та кнопку знову активними
      // startButton.disabled = false;
      // dateTimePicker.disabled = false;

      // Повернення таймера в початкове положення
      updateTimerDisplay(0);
    }
  }, 1000);
}
// Ініціалізація flatpickr
flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: function (selectedDates) {
    // Отримуємо обрану користувачем дату
    userSelectedDate = selectedDates[0];

    const currentDate = new Date();
    const difference = userSelectedDate - currentDate;

    // Перевірка чи дата в майбутньому
    if (difference <= 0) {
      // Дата в минулому, робимо кнопку неактивною
      document.querySelector('[data-start]').disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      // Дата в майбутньому, робимо кнопку активною
      document.querySelector('[data-start]').disabled = false;
    }
  },
});

// Обробник події кліку на кнопку "Start"
document.querySelector('[data-start]').addEventListener('click', startTimer);
