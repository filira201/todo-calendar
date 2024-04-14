import "../css/style.css";

const currentDateTitle = document.querySelector(".current-date");
const icons = document.querySelector(".icons");
const allDays = document.querySelector(".days");
const calendar = document.querySelector(".calendar");
const modal = document.querySelector(".modal-add-task");

let currentDate = new Date();
let currYear = currentDate.getFullYear();
let currMonth = currentDate.getMonth();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Septebmer",
  "October",
  "November",
  "December",
];

const currentDaysOnTable = 42;

const numberDayInWeek = [6, 0, 1, 2, 3, 4, 5];

const dayIsWeekend = (day, plusOrMinusMonth = 0, plusOrMinus = "") => {
  let newCurrentMonth = currMonth;
  let minusOrPlusYear = 0;

  if (plusOrMinus === "+") {
    if (newCurrentMonth + plusOrMinusMonth > 11) {
      minusOrPlusYear = 1;
      plusOrMinusMonth = 0;
      newCurrentMonth = 0;
    }
  } else if (plusOrMinus === "-") {
    if (newCurrentMonth - Math.abs(plusOrMinusMonth) < 0) {
      minusOrPlusYear = -1;
      plusOrMinusMonth = 0;
      newCurrentMonth = 11;
    }
  }

  if (
    numberDayInWeek[
      new Date(
        currYear + minusOrPlusYear,
        newCurrentMonth + plusOrMinusMonth,
        day
      ).getDay()
    ] === 5 ||
    numberDayInWeek[
      new Date(
        currYear + minusOrPlusYear,
        newCurrentMonth + plusOrMinusMonth,
        day
      ).getDay()
    ] === 6
  ) {
    return true;
  }
  return false;
};

const renderCalendar = () => {
  let dayLiTag = ``;

  const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
  const firstDayOfMonth =
    numberDayInWeek[new Date(currYear, currMonth, 1).getDay()];
  let lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

  for (let i = firstDayOfMonth; i > 0; i--) {
    const isWeekend = dayIsWeekend(lastDateOfLastMonth - i + 1, -1, "-");

    dayLiTag += `<li class="${isWeekend ? "weekend" : "weekday"}">
    <div class="days-header">
      <span id="task-${
        currentDate.getMonth() - 1 < 0
          ? currentDate.getFullYear() - 1
          : currentDate.getFullYear()
      }-${currentDate.getMonth() - 1 < 0 ? 11 : currentDate.getMonth() - 1}-${
      lastDateOfLastMonth - i + 1
    }" class="material-symbols-outlined add-task"> add </span>
      <p class="day inactive">${lastDateOfLastMonth - i + 1}</p>
    </div>
    <div class="tasks">
    </div>
  </li>`;
  }

  for (let i = 1; i <= lastDateOfMonth; i++) {
    const isWeekend = dayIsWeekend(i);
    const isToday =
      i === new Date().getDate() &&
      currMonth === new Date().getMonth() &&
      currYear === new Date().getFullYear()
        ? "day active"
        : "day";

    dayLiTag += `<li class="${isWeekend ? "weekend" : "weekday"}">
    <div class="days-header">
      <span id="task-${currentDate.getFullYear()}-${currentDate.getMonth()}-${i}" class="material-symbols-outlined add-task"> add </span>
      <p class="${isToday}">${i}</p>
    </div>
    <div class="tasks">
    </div>
  </li>`;
  }

  const occupiedCells = currentDaysOnTable - firstDayOfMonth - lastDateOfMonth;

  for (let i = 1; i <= occupiedCells; i++) {
    const isWeekend = dayIsWeekend(i, 1, "+");

    dayLiTag += `<li class="${isWeekend ? "weekend" : "weekday"}">
    <div class="days-header">
      <span id="task-${
        currentDate.getMonth() + 1 > 11
          ? currentDate.getFullYear() + 1
          : currentDate.getFullYear()
      }-${
      currentDate.getMonth() + 1 > 11 ? 0 : currentDate.getMonth() + 1
    }-${i}" class="material-symbols-outlined add-task"> add </span>
      <p class="day inactive">${i}</p>
    </div>
    <div class="tasks">
    </div>
  </li>`;
  }

  currentDateTitle.textContent = `${months[currMonth]} ${currYear}`;
  allDays.innerHTML = dayLiTag;
};

renderCalendar();

icons.addEventListener("click", (e) => {
  if (e.target.id === "today") {
    currentDate = new Date();
    currMonth = currentDate.getMonth();
    currYear = currentDate.getFullYear();

    renderCalendar();
  } else if (e.target.id === "prev") {
    if (currMonth === 0) {
      currentDate = new Date(currYear - 1, 11);
    } else {
      currentDate = new Date(currYear, currMonth - 1);
    }
    currYear = currentDate.getFullYear();
    currMonth = currentDate.getMonth();

    renderCalendar();
  } else if (e.target.id === "next") {
    if (currMonth === 11) {
      currentDate = new Date(currYear + 1, 0);
    } else {
      currentDate = new Date(currYear, currMonth + 1);
    }
    currYear = currentDate.getFullYear();
    currMonth = currentDate.getMonth();

    renderCalendar();
  }
});

calendar.addEventListener("click", (e) => {
  if (e.target.textContent.trim() === "add") {
    console.log(e.target);
    modal.classList.toggle("hidden");
  }
});

document.getElementById("close-modal").addEventListener("click", () => {
  modal.classList.toggle("hidden");
});
