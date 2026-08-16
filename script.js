// menu items - grouped by category
// each item has a name, description, price, and an image filename
const menu = {
  starters: [
    { name: "Samosa", desc: "Crispy pastry filled with spiced meat, onion and garlic, served with a tangy dipping sauce.", price: "KSh 350", img: "soamosa.jpg" },
    { name: "Chapati", desc: "Soft, flaky flatbread, perfect for scooping up stews or enjoying with a cup of spiced tea.", price: "KSh 150", img: "chapati.jpg" },
    { name: "Mandazi", desc: "Lightly sweet, pillowy fried dough spiced with cardamom - a classic East African favourite.", price: "KSh 200", img: "mandazi.jpg" },
  ],
  mains: [
    { name: "Somali Breakfast", desc: "Soft canjeero pancake bread served with a rich stew, honey and butter, paired with spiced tea.", price: "KSh 600", img: "somali-breakfast.jpg" },
  ],
  desserts: [
    { name: "Malawah", desc: "Flaky, layered pancake, lightly sweetened and often served warm with honey.", price: "KSh 350", img: "malawah.jpg" },
    { name: "Doolsho", desc: "Soft cardamom-spiced sponge cake, a favourite at celebrations.", price: "KSh 400", img: "doolsho.jpg" },
    { name: "Xalwo", desc: "Traditional Somali halwa - a sticky, fragrant sweet made with cardamom, nutmeg and ghee.", price: "KSh 450", img: "xalwo.jpg" },
  ],
};

const menuGrid = document.getElementById("menuGrid");

// builds the dish cards for whichever tab is clicked
function showMenu(category) {
  if (!menuGrid) return;

  let html = "";
  for (let i = 0; i < menu[category].length; i++) {
    const item = menu[category][i];
    html += `
      <article class="dish">
        <img class="dish-photo" src="images/${item.img}" alt="${item.name}" onerror="this.remove()">
        <div class="dish-top">
          <h3>${item.name}</h3>
          <span class="price">${item.price}</span>
        </div>
        <p>${item.desc}</p>
      </article>
    `;
  }
  menuGrid.innerHTML = html;
}

if (menuGrid) {
  showMenu("starters"); // default tab when the dining page loads
}

// menu tab buttons
const menuTabs = document.querySelectorAll(".menu-tabs .tab");
menuTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    menuTabs.forEach(function (t) { t.classList.remove("active"); });
    tab.classList.add("active");
    showMenu(tab.dataset.menu);
  });
});

// navbar - background changes when you scroll down + mobile menu toggle
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const navToggle = document.getElementById("navToggle");

if (nav) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });

  // close the mobile menu after clicking a link
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
    }
  });
}

// fade sections in as you scroll down (elements with class "reveal")
const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(function (el) {
  revealObserver.observe(el);
});

// reservation form - switching between Table and Room
const formTypeInput = document.getElementById("formType");
const roomRow = document.getElementById("roomRow");

const switchTabs = document.querySelectorAll(".form-switch .tab");
switchTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    switchTabs.forEach(function (t) { t.classList.remove("active"); });
    tab.classList.add("active");

    if (tab.dataset.form === "room") {
      formTypeInput.value = "room";
      roomRow.hidden = false;
    } else {
      formTypeInput.value = "table";
      roomRow.hidden = true;
    }
  });
});

// clicking "Book" on a room card sends you to the reserve page
// with that room pre-selected
const bookButtons = document.querySelectorAll(".book-room");
bookButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const roomName = encodeURIComponent(btn.dataset.room);
    window.location.href = "reserve.html?type=room&room=" + roomName;
  });
});

// if we arrived on reserve.html from a "Book" button, open the Room tab
// and select the right suite automatically
if (formTypeInput && roomRow) {
  const params = new URLSearchParams(window.location.search);
  if (params.get("type") === "room") {
    const roomTabBtn = document.querySelector('.form-switch .tab[data-form="room"]');
    if (roomTabBtn) roomTabBtn.click();

    const roomSelect = document.getElementById("roomSelect");
    const chosenRoom = params.get("room");
    if (roomSelect && chosenRoom) {
      roomSelect.value = chosenRoom;
    }
  }
}

// saving the reservation form
// there's no backend, so we just save it in localStorage
const reserveForm = document.getElementById("reserveForm");
const formStatus = document.getElementById("formStatus");

// stop the calendar picker from offering past dates in the first place
const dateInput = document.querySelector('input[name="date"]');
if (dateInput) {
  const todayStr = new Date().toISOString().split("T")[0];
  dateInput.min = todayStr;
}

function getSavedReservations() {
  const saved = localStorage.getItem("qahira_reservations");
  if (!saved) return [];
  return JSON.parse(saved);
}

// checks if a room is already booked for any of the same nights
// returns true if there is a clash
function roomIsTaken(reservations, roomName, startDate, nights) {
  const newStart = new Date(startDate);
  const newEnd = new Date(startDate);
  newEnd.setDate(newEnd.getDate() + Number(nights || 1));

  for (let i = 0; i < reservations.length; i++) {
    const r = reservations[i];
    if (r.type !== "room" || r.room !== roomName) continue;

    const existingStart = new Date(r.date);
    const existingEnd = new Date(r.date);
    existingEnd.setDate(existingEnd.getDate() + Number(r.nights || 1));

    // two date ranges overlap if one starts before the other ends
    const overlaps = newStart < existingEnd && existingStart < newEnd;
    if (overlaps) return true;
  }
  return false;
}

if (reserveForm) {
  reserveForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(reserveForm);
    const name = formData.get("name").trim();
    const contact = formData.get("contact").trim();
    const date = formData.get("date");
    const type = formData.get("type");
    const room = formData.get("room");
    const nights = formData.get("nights");

    if (!name || !contact || !date) {
      formStatus.textContent = "Please fill in your name, contact and date.";
      formStatus.className = "form-status err";
      return;
    }

    // block dates that have already passed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickedDate = new Date(date);

    if (pickedDate < today) {
      formStatus.textContent = "That date has already passed. Please pick a future date.";
      formStatus.className = "form-status err";
      return;
    }

    const reservations = getSavedReservations();

    if (type === "room" && roomIsTaken(reservations, room, date, nights)) {
      formStatus.textContent = "Sorry, " + room + " is already booked for those dates. Please pick another date or suite.";
      formStatus.className = "form-status err";
      return;
    }

    const newBooking = {
      id: reservations.length + 1,
      type: type,
      name: name,
      contact: contact,
      date: date,
      guests: formData.get("guests"),
      room: room,
      nights: nights,
      notes: formData.get("notes"),
    };

    reservations.push(newBooking);
    localStorage.setItem("qahira_reservations", JSON.stringify(reservations));

    formStatus.textContent = "Reservation received! Reference #" + newBooking.id + " - we'll confirm shortly.";
    formStatus.className = "form-status ok";

    reserveForm.reset();
    roomRow.hidden = formTypeInput.value !== "room";
  });
}
