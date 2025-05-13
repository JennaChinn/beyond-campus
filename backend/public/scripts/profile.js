import { getCookie } from "./getCookie.js";
import { category_noseparate } from "./category_noseparate.js";

function getTagsFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("user_id");
}

function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

const userCardsContainer = document.querySelector(".friends");

window.addEventListener("load", () => {
  // Get the JWT token from the cookie
  const jwt = getCookie("jwt");

  if (!jwt) {
    console.error("JWT token not found in cookie");
    window.location.href = "/auth/logout";
    return;
  }
  // Include the token in the fetch request headers
  const headers = new Headers({
    Authorization: `${jwt}`,
    "Content-Type": "application/json",
  });

  const user_id = getTagsFromURL();

  fetch(`/api/friend?user_id=${user_id}`, {
    method: "GET",
    headers,
  })
    .then((response) => response.json())
    .then((userData) => {
      if (!userData.success) {
        alert("Failed to get profile");
        window.location.href="/"
      }
      if (userData.permissions=="1") window.location.href="/";
      else document.body.style.visibility="visible";
      // Update the username and bio on the page with fetched data
      const usernameElement = document.querySelector(".username");
      const bioElement = document.querySelector(".bio");
      const genderElement = document.querySelector(".gender");
      const yearElement = document.querySelector(".year");
      const majorElement = document.querySelector(".major");
      const registElement = document.querySelector(".registration_date");

      usernameElement.innerHTML = `<strong>${userData.username}</strong>`;
      bioElement.textContent =
        decodeHtmlEntities(userData.bio) || "Bio is empty!";
      genderElement.textContent = userData.gender;
      yearElement.textContent = userData.year;
      majorElement.textContent = userData.major;
      registElement.textContent =
        "Joined: " +
        new Date(userData.registration_date).toLocaleDateString();
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  fetch(`/api/friend/hashtag?user_id=${user_id}`, {
    method: "GET",
    headers,
  })
    .then((response) => response.json())
    .then((data) => {
      for (const hashtag of data.data) {
        const hashtagsDiv = document.querySelector(".hashtags");
        const hashtagSpan = document.createElement("span");
        hashtagSpan.className = "hashtag";
        category_noseparate.then((d) => {
          hashtagSpan.textContent =
          "#" + d[hashtag.tag_number];
        });
        hashtagsDiv.appendChild(hashtagSpan);
      }
    })
    .catch((error) => {
      console.error("Error fetching hashtag data:", error);
    });

  fetch("/api/friends", {
    method: "GET",
    headers,
  })
    .then((response) => response.json())
    .then((data) => {
      const friendsList = data?.data;
      const isFriendOfUser = friendsList?.some(
        (friend) => friend.user_id == user_id
      );
      if (!isFriendOfUser) {
        document.querySelector(".add-button-wrapper").classList.add("show");
      } else {
        document.querySelector(".remove-button-wrapper").classList.add("show");
      }
    })
      .catch((error) => {
        console.error("Error getting friends: ", error);
      });

      fetch("/api/block",{
        method: "GET",
        headers
      })
        .then((response) => response.json().then((data) => {
          if (!data.data) return;
          var blocks = data.data;
          if (blocks.every((b) => b.user_id != user_id)) {
            document.querySelector(".block-user-wrapper").classList.add("show");
          }
          else {
            document.querySelector(".unblock-user-wrapper").classList.add("show");
          }
        }));
      document.querySelector(".report-user-button").style.display="block";
});
