import { getCookie } from "./getCookie.js";

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
})