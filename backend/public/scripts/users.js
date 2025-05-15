import { getCookie } from "./getCookie.js"

function createUserCard(user) {
  const card = document.createElement("div");
  card.className = "user-card";
  card.innerHTML = `
          <a href="/profile?user_id=${user.user_id}"  style="color: black;"><img src="https://cdn.vectorstock.com/i/preview-1x/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg" alt="${user.username}">
          <h2>${user.username}</h2></a>
          <p><strong>Email:</strong> ${user.email}</p>
          </div>
      `;
  return card;
}

window.addEventListener("load", () => {
    // Get the JWT token from the cookie
    const jwt = getCookie("jwt");
    const cardContainer=document.getElementById("user-cards");
    if (jwt) {
        const headers = new Headers({
          Authorization: `${jwt}`,
          "Content-Type": "application/json",
        });
        
        fetch("/admin/verify", {
            method: "GET",
            headers,
        })
        .then((response) => response.json()
        .then((data) => {
            if (!data.data) {
                alert("Access Denied");
                window.location.href = "/";
            }
            else {
                document.body.style.visibility="visible";
                fetch(`/admin/users/all`, {
                  method: "GET",
                  headers,
                })
                .then((response) => response.json())
                .then((data) => data.data)
                .then((data) => {
                    data.forEach((x) => {
                        cardContainer.appendChild(createUserCard(x));
                    })
                });
            }
        }));
        
    } else {
        console.error("JWT token not found in cookie");
        window.location.href = "/auth/logout";
    }
});