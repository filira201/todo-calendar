import "../css/style.css";

const currentDateTitle = document.querySelector(".current-date");
const icons = document.querySelector(".icons");
const allDays = document.querySelector(".days");
const calendar = document.querySelector(".calendar");
const modalForm = document.querySelector(".modal-add-task");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task");
const deleteTaskBtn = document.getElementById("delete-task");
const titleInput = document.getElementById("title-input");
const descriptionInput = document.getElementById("description-input");

let taskCurrentId = "";
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

const addOrUpdateTask = () => {
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${taskCurrentId.split("-", 3).join("-")}-${Date.now()}`,
    title: titleInput.value,
    description: descriptionInput.value,
  };

  if (dataArrIndex === -1) {
    taskData.push(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }
  localStorage.setItem("data", JSON.stringify(taskData));
  renderCalendar();
  reset();
};

// const updateTaskContainer = (taskObj) => {
//   const { id, title } = taskObj;
//   const parentTaskElement = document.getElementById(
//     `${id.split("-", 3).join("-")}-li-container`
//   );
//   if (parentTaskElement.children.length === 1) {
//     parentTaskElement.innerHTML += `
//     <div id="${id.split("-", 3).join("-")}-tasks-container" class="tasks">
//       <p id="${id}" class="task">${title}</p>
//     </div>
//   `;
//   } else {
//     document.getElementById(
//       `${id.split("-", 3).join("-")}-tasks-container`
//     ).innerHTML += `<p id="${id}" class="task">${title}</p>`;
//   }
//   document
//     .getElementById(`${id.split("-", 3).join("-")}-tasks-container`)
//     .addEventListener("click", viewTaskOrEditTask);
// };

const renderTasksContainer = () => {
  taskData.forEach(({ id, title }) => {
    const parentTaskElement = document.getElementById(
      `${id.split("-", 3).join("-")}-li-container`
    );
    if (parentTaskElement) {
      if (parentTaskElement.children.length === 1) {
        parentTaskElement.innerHTML += `
        <div id="${id.split("-", 3).join("-")}-tasks-container" class="tasks">
          <p id="${id}" class="task">${title}</p>
        </div>
      `;
      } else {
        document.getElementById(
          `${id.split("-", 3).join("-")}-tasks-container`
        ).innerHTML += `<p id="${id}" class="task">${title}</p>`;
      }
      document
        .getElementById(`${id.split("-", 3).join("-")}-tasks-container`)
        .addEventListener("click", viewTaskOrEditTask);
    }
  });
};

const viewTaskOrEditTask = (e) => {
  const dataArrIndex = taskData.findIndex((item) => item.id === e.target.id);
  if (dataArrIndex >= 0) {
    taskCurrentId = e.target.id;
    currentTask = taskData[dataArrIndex];
    titleInput.value = currentTask.title;
    descriptionInput.value = currentTask.description;

    modalForm.classList.toggle("hidden");
  }
};

const reset = () => {
  titleInput.value = "";
  descriptionInput.value = "";
  modalForm.classList.toggle("hidden");
  currentTask = {};
};

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateTask();
});

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

    dayLiTag += `<li id="${
      currentDate.getMonth() - 1 < 0
        ? currentDate.getFullYear() - 1
        : currentDate.getFullYear()
    }-${currentDate.getMonth() - 1 < 0 ? 11 : currentDate.getMonth() - 1}-${
      lastDateOfLastMonth - i + 1
    }-li-container" class="${isWeekend ? "weekend" : "weekday"}">
    <div class="days-header">
      <span id="${
        currentDate.getMonth() - 1 < 0
          ? currentDate.getFullYear() - 1
          : currentDate.getFullYear()
      }-${currentDate.getMonth() - 1 < 0 ? 11 : currentDate.getMonth() - 1}-${
      lastDateOfLastMonth - i + 1
    }-task-add-icon" class="material-symbols-outlined add-task"> add </span>
      <p class="day inactive">${lastDateOfLastMonth - i + 1}</p>
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

    dayLiTag += `<li id="${currentDate.getFullYear()}-${currentDate.getMonth()}-${i}-li-container" class="${
      isWeekend ? "weekend" : "weekday"
    }">
    <div class="days-header">
      <span id="${currentDate.getFullYear()}-${currentDate.getMonth()}-${i}-task-add-icon" class="material-symbols-outlined add-task"> add </span>
      <p class="${isToday}">${i}</p>
    </div>
  </li>`;
  }

  const occupiedCells = currentDaysOnTable - firstDayOfMonth - lastDateOfMonth;

  for (let i = 1; i <= occupiedCells; i++) {
    const isWeekend = dayIsWeekend(i, 1, "+");

    dayLiTag += `<li id="${
      currentDate.getMonth() + 1 > 11
        ? currentDate.getFullYear() + 1
        : currentDate.getFullYear()
    }-${
      currentDate.getMonth() + 1 > 11 ? 0 : currentDate.getMonth() + 1
    }-${i}-li-container" class="${isWeekend ? "weekend" : "weekday"}">
    <div class="days-header">
      <span id="${
        currentDate.getMonth() + 1 > 11
          ? currentDate.getFullYear() + 1
          : currentDate.getFullYear()
      }-${
      currentDate.getMonth() + 1 > 11 ? 0 : currentDate.getMonth() + 1
    }-${i}-task-add-icon" class="material-symbols-outlined add-task"> add </span>
      <p class="day inactive">${i}</p>
    </div>
  </li>`;
  }

  currentDateTitle.textContent = `${months[currMonth]} ${currYear}`;
  allDays.innerHTML = dayLiTag;
  renderTasksContainer();
};

renderCalendar();

icons.addEventListener("click", (e) => {
  if (e.target.id === "today") {
    currentDate = new Date();
    currMonth = currentDate.getMonth();
    currYear = currentDate.getFullYear();

    renderCalendar();
    return;
  } else if (e.target.id === "prev") {
    if (currMonth === 0) {
      currentDate = new Date(currYear - 1, 11);
    } else {
      currentDate = new Date(currYear, currMonth - 1);
    }
    currYear = currentDate.getFullYear();
    currMonth = currentDate.getMonth();

    renderCalendar();
    return;
  } else if (e.target.id === "next") {
    if (currMonth === 11) {
      currentDate = new Date(currYear + 1, 0);
    } else {
      currentDate = new Date(currYear, currMonth + 1);
    }
    currYear = currentDate.getFullYear();
    currMonth = currentDate.getMonth();

    renderCalendar();
    return;
  }
});

calendar.addEventListener("click", (e) => {
  if (e.target.textContent.trim() === "add") {
    taskCurrentId = e.target.id;
    modalForm.classList.toggle("hidden");
  }
});

document.getElementById("close-modal").addEventListener("click", () => {
  reset();
});
