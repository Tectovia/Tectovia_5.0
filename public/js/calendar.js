async function fetchData() {
  const apiUrl = "http://localhost:3000/admin/calendar"; // Replace with your API URL

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Rethrow the error for further handling, if needed
  }
}

// Call the function and work with the returned promise
fetchData()
  .then((data) => {
    console.log(data);
    loadCalendar(data);
    buttons(data);
  })
  .catch((error) => {
    console.error("Error in fetchData:", error);
  });

const calendar = document.querySelector("#calendar");
const monthBanner = document.querySelector("#month");
const btnClose = document.querySelector(".btnClose");

let navigation = 0;

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const btnBack = document.querySelector("#btnBack");
const btnNext = document.querySelector("#btnNext");

// calendar function definition
function loadCalendar(data) {
  const eventform = document.querySelector(".addEvent");

  if (!eventform) {
    console.error("Error: .addEvent not found");
    return;
  }

  const dt = new Date();
  const currentYear = 2024;
  let day, year, month;

  if (navigation !== 0) {
    dt.setMonth(new Date().getMonth() + navigation);
  }

  if (dt.getMonth() === 11) {
    btnNext.classList.add("hide_cal");
  } else {
    btnNext.classList.remove("hide_cal");
  }

  if (dt.getMonth() === 0) {
    btnBack.classList.add("hide_cal");
  } else {
    btnBack.classList.remove("hide_cal");
  }

  if (dt.getFullYear() !== currentYear) {
    day = dt.getDate();
    month = 11;
    year = currentYear;
  } else {
    day = dt.getDate();
    month = dt.getMonth();
    year = dt.getFullYear();
  }

  monthBanner.innerText = `${dt.toLocaleDateString("en-us", {
    month: "long",
  })} ${year}`;
  calendar.innerHTML = "";

  const dayInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const dateText = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const dayString = dateText.split(", ")[0];
  const emptyDays = weekdays.indexOf(dayString);

  for (let i = 1; i <= dayInMonth + emptyDays; i++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");

    if (i > emptyDays) {
      dayBox.innerText = i - emptyDays;

      const para = document.createElement("p");

      const dateVal = i - emptyDays < 10 ? "0" + (i - emptyDays) : i - emptyDays;
      const monthVal = month + 1 < 10 ? "0" + (month + 1) : month + 1;
      const dateText = `${dateVal}-${monthVal}-${year}`;

      if (eventdata[dateText].desc !== "null") {
        para.innerHTML = eventdata[dateText].desc;
        para.classList.add("txtTitle");
      }

      const para2 = document.createElement("p");
      if ((eventdata[dateText].status).toLowerCase() === "holiday") {
        para2.innerHTML = "Holiday";
        para2.classList.add("holiday");
      } else {
        para2.innerHTML = "";
      }

      dayBox.appendChild(para);
      dayBox.appendChild(para2);

      if (i - emptyDays === day && navigation === 0) {
        dayBox.id = "currentDay";
      }

      dayBox.addEventListener("click", () => {
        console.log(dateText);
        eventform.classList.add("display");
        event.action = `/admin/academic_calendar/event/${dateText}`;
      });

      btnClose.addEventListener("click", () => {
        eventform.classList.remove("display");
      });
    } else {
      dayBox.classList.add("plain");
    }
    calendar.append(dayBox);
  }
}

function buttons(data) {
  btnBack.addEventListener("click", () => {
    navigation--;
    loadCalendar(data);
  });
  btnNext.addEventListener("click", () => {
    navigation++;
    loadCalendar(data);
  });
}
