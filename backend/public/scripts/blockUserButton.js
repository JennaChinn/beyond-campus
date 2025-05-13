import { getCookie } from "./getCookie.js";
import { confirmMessage, promptMessage, alertMessage } from "./new-prompt.js";

function getTagsFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("user_id");
}
const user_id = getTagsFromURL();

const promptBox = document.querySelector(".prompt-box");
promptBox.innerHTML = `<p id="prompt-title">Prompt title</p>
<textarea id="promptTextarea"></textarea>
<button class="hashtag" id="prompt-cancel">Cancel</button>
<button class="hashtag" id="prompt-accept">Submit</button>`;

const blockUserButton = document.querySelector(".block-user-button");
blockUserButton.addEventListener("click", () => {
  const jwt = getCookie("jwt");

  if (jwt) {
    // Include the token in the fetch request headers
    const headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    fetch("/api/block", {
        method: "POST",
        headers,
        body: JSON.stringify({block_id: user_id}),
    })
    .then((response) => response.json())
    .then((result) => {
        alertMessage(promptBox,"User blocked!",()=>{window.location.href="/"});
    })
    .catch((error) => {
        console.error("Error blocking user");
    });
  } else {
    console.error("JWT token not found in cookie");
    window.location.href = "/auth/logout";
  }
});

const unblockUserButton = document.querySelector(".unblock-user-button");
unblockUserButton.addEventListener("click", () => {
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
        body: JSON.stringify({block_id: user_id}),
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
});

const reportUserButton = document.querySelector(".report-user-button");
reportUserButton.addEventListener("click", () => {
  const jwt = getCookie("jwt");
  promptMessage(promptBox,"Why are you reporting this user?",(notes) => {
    if (jwt) {
      // Include the token in the fetch request headers
      const headers = new Headers({
        Authorization: `${jwt}`,
        "Content-Type": "application/json",
      });
      fetch("/api/report", {
          method: "POST",
          headers,
          body: JSON.stringify({report_id: user_id, message: "", notes: notes}),
      })
      .then((response) => response.json())
      .then((result) => {
          confirmMessage(promptBox,"User reported",() => window.location.reload());
      })
      .catch((error) => {
          console.error("Error reporting user");
      });
    } else {
      console.error("JWT token not found in cookie");
      window.location.href = "/auth/logout";
    }
  });
});