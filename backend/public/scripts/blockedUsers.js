import { getCookie } from "./getCookie.js";
import { alertMessage } from "./new-prompt.js";

const blockButton = document.querySelector("#blocked-button");
const blockDiv = document.querySelector(".blocked-users");
const promptBox = document.querySelector(".prompt-box");
var show = false;
var openPopup;

blockButton.addEventListener("click", () => {
    if (show) {
        blockButton.innerText = "View Blocked Users";
        blockDiv.style.display="none";
    }
    else {
        blockButton.innerText = "Hide Blocked Users";
        blockDiv.style.display="block";
    }
    show = !show;
});

const addUser = (user) => {
    var li = document.createElement("li");
    var liid = "block" + user.user_id;
    var popupId = liid + "pop";

    li.innerText = user.username;
    li.id = liid;
    li.className = "popup";
    li.addEventListener("click", () => showPopup(popupId));

    const popupText = document.createElement("span");
    popupText.className = "popuptext";
    popupText.id = popupId;

    var unblockButton = document.createElement("button");
    unblockButton.className = "option-button";
    unblockButton.innerText = "Unblock user";
    unblockButton.addEventListener("click", () => unblockUser(user.user_id));

    popupText.appendChild(unblockButton);
    li.appendChild(popupText);
    return li;
}

const showPopup = (id) => {
    const popup = document.getElementById(id);
    popup.classList.toggle("show");
    if (openPopup) {
        if (openPopup == id) openPopup=null;
        else {
            document.getElementById(openPopup).classList.toggle("show");
            openPopup = id;
        }
    }
    else openPopup = id;
}

const unblockUser = (id) => {
    const jwt = getCookie("jwt");
  
    if (jwt) {
      // Include the token in the fetch request headers
      const headers = new Headers({
        Authorization: `${jwt}`,
        "Content-Type": "application/json",
      });
      fetch("/api/block", {
          method: "DELETE",
          headers,
          body: JSON.stringify({block_id: id}),
      })
      .then((response) => response.json())
      .then((result) => {
        alertMessage(promptBox,"User unblocked",() => window.location.reload());
      })
      .catch((error) => {
          console.error("Error unblocking user");
      });
    } else {
      console.error("JWT token not found in cookie");
      window.location.href = "/auth/logout";
    }
}

const jwt = getCookie("jwt");
if (jwt) {
    const headers = new Headers({
        Authorization: `${jwt}`,
        "Content-Type": "application/json",
    });
    fetch("/api/block",{
        method: "GET",
        headers,
    })
        .then((response) => response.json().then((data) => {
            if (!data.data.length) {
                blockDiv.innerText = "No users blocked";
                return;
            }
            var ul = blockDiv.appendChild(document.createElement("ul"));
            data.data.forEach((user) => ul.appendChild(addUser(user)));
        }));
}