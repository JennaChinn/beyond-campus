import { getCookie } from "./getCookie.js";

const newMessageWindow = document.querySelector(".new-message-popup");

const closeWindow = () => { newMessageWindow.classList.remove("show"); }

document.querySelector(".new-message-button").addEventListener("click", (e) => {
  if (!newMessageWindow.classList.contains("show")) {
    e.stopPropagation();
    newMessageWindow.classList.add("show");
  }
});

window.addEventListener("click",closeWindow);

newMessageWindow.addEventListener("click",(e) => {
  e.stopPropagation();
});


window.addEventListener("load", () => {
    // Get the JWT token from the cookie
    const jwt = getCookie("jwt");
  
    if (!jwt) {
      console.error("JWT token not found in cookie");
      window.location.href = "/auth/logout";
    }
    // Include the token in the fetch request headers
    const headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    fetch("/messages/previews/", {
      method: "GET",
      headers,
    })
        .then((response) => {
            response.json()
            .then((data) => {
                const previews = document.querySelector(".previews");
                const messages = data.data;
                if (!Object.keys(messages).length) document.querySelector(".preview-container").innerText="No messages";
                Object.keys(messages).forEach((user_id) => {
                    var li = document.createElement("li");
                    if (messages[user_id].body.length > 30) messages[user_id].body = messages[user_id].body.substring(0,29) + "...";
                    li.innerHTML = `<strong>${messages[user_id].username}</strong><br>${messages[user_id].body}`;
                    li.addEventListener("click", () => {
                        window.location.href=`/messages/conversation?user_id=${user_id}`;
                    });
                    previews.appendChild(li);
                });
            });
        });
    
    const closeWindowButton = document.createElement("div");
    closeWindowButton.id = "close-window-button";
    closeWindowButton.innerHTML = "&#10006;"
    closeWindowButton.addEventListener("click",closeWindow);
    newMessageWindow.appendChild(closeWindowButton);

    fetch("/api/friends", {
      method: "GET",
      headers,
    })
      .then((response) => response.json()
      .then((data) => {
        const friends = data.data;
        friends.forEach((friend) => {
          var friendDiv = document.createElement("div");
          friendDiv.className = "friend-div";
          friendDiv.innerHTML = friend.username;
          friendDiv.addEventListener("click", () => {
            window.location.href = `/messages/conversation?user_id=${friend.friend_user_id}`;
          })
          newMessageWindow.appendChild(friendDiv);
        });
      }));
})