async function fetchdata() {
  const apiUrl = "http://localhost:3000/api/test"; // Replace with your API URL

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(HTTP `error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Rethrow the error for further handling, if needed
  }
}
var rdata;
// Call the function and work with the returned promise
fetchdata()
  .then((data) => {
    console.log(data);
    loadCalendar(data);
    buttons(data);
  })
  .catch((error) => {
    console.error("Error in fetchdata:", error);
  });

// console.log(returndata);
const calendar = document.querySelector("#calendar");
const monthBanner = document.querySelector("#month");
const btnClose = document.querySelector(".btnClose");

let navigation = 0;
let clicked = null;

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

// calendar funcation definition
function loadCalendar(data) {
  const eventform = document.querySelector(".addEvent");
  const event = document.querySelector("#event_form");
  const eventdata = data;

  const dt = new Date();
  const currentyear = 2024;
  var day;
  var year;
  var month;
  // dec
  if (dt.getMonth() == 11) {
    btnNext.classList.add("hide");
  } else {
    btnNext.classList.remove("hide");
  }
  // jan
  if (dt.getMonth() == 0) {
    btnBack.classList.add("hide");
  } else {
    btnBack.classList.remove("hide");
  }
  if (navigation != 0) {
  
    dt.setMonth(new Date().getMonth() + navigation);
    if (dt.getMonth() == 11) {
      btnNext.classList.add("hide");
      
    } else {
      btnNext.classList.remove("hide");
    }
    if (dt.getMonth() == 0) {
    
      btnBack.classList.add("hide");
    } else {
      btnBack.classList.remove("hide");
    }
    if (dt.getFullYear() != currentyear) {
      day = dt.getDate();
      month = 11;
      year = currentyear;
    } else {
      day = dt.getDate();
      month = dt.getMonth();
      year = dt.getFullYear();
    }
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
  const firstDayofMonth = new Date(year, month, 1);
  const dateText = firstDayofMonth.toLocaleDateString("en-us", {
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
    const monthVal = month + 1 < 10 ? "0" + (month + 1) : month + 1;
    const dateVal = i - emptyDays < 10 ? "0" + (i - emptyDays) : i - emptyDays;
    const dateText = `${dateVal}-${monthVal}-${year}`;
    if (i > emptyDays) {
      dayBox.innerText = i - emptyDays;
    // console.log(dateText);
      const para = document.createElement("p");

      if (eventdata[dateText].desc != "null") {
        para.innerHTML = eventdata[dateText].desc;
        para.classList.add("txtTitle");
      } 

      const para2 = document.createElement("p");
      if ( (eventdata[dateText].status).toLowerCase()== "holiday") {
        console.log(eventdata[dateText].status);
        para2.innerHTML = "Holiday";
        para2.classList.add("holiday");
      } else {
        para2.innerHTML = "";
      }

      dayBox.appendChild(para);
      dayBox.appendChild(para2);
      //Event Day
      if (i - emptyDays === day && navigation == 0) {
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

// console.log(hari());