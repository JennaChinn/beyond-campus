import { getCookie } from "./getCookie.js";
const jwt = getCookie("jwt");

var openPopup;
var openPopupElement;
var headers;

const createUserPopup = (element, data, is_post) => {
    element.classList.add("popup");
    var popupId;
    if (is_post) popupId = "p" + data.post_id;
    else popupId = "c" + data.comment_id;
    element.addEventListener("click", () => showPopup(popupId, element.id));
        
    const popupText = document.createElement("span");
    popupText.className = "popuptext";
    popupText.id = popupId;

    const deleteButton = document.createElement("button");
    deleteButton.className = "option-button";
    deleteButton.innerText = `Delete ${is_post ? "post" : "comment"}`;
    deleteButton.addEventListener("click", () => {
        if (is_post) deletePost(data.post_id);
        else deleteComment(data.comment_id);
    });

    popupText.appendChild(deleteButton);
    element.appendChild(popupText);
}

const deletePost = (post_id) => {
    var headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    
    fetch("/api/forum/posts", {
        method: "DELETE",
        headers,
        body: JSON.stringify({post_id: post_id}),
    })
    .then((response) => window.location.reload());
}

const deleteComment = (comment_id) => {
    var headers = new Headers({
      Authorization: `${jwt}`,
      "Content-Type": "application/json",
    });
    
    fetch("/api/forum/comments", {
        method: "DELETE",
        headers,
        body: JSON.stringify({comment_id: comment_id}),
    })
    .then((response) => window.location.reload());
}
  
const showPopup = (id, element_id) => {
    document.getElementById(id).classList.toggle("show");
    document.getElementById(element_id).classList.toggle("show");

    if (openPopup) {
        if (openPopup == id) openPopup=null;
        else {
            document.getElementById(openPopup).classList.toggle("show");
            openPopup = id;
        }
    }
    else openPopup = id;

    if (openPopupElement) {
      if (openPopupElement == element_id) openPopupElement = null;
      else {
        document.getElementById(openPopupElement).classList.toggle("show");
        openPopupElement = element_id;
      }
    }
    else openPopupElement = element_id;
}

window.addEventListener("load", () => {
    // Get the JWT token from the cookie
    if (jwt) {
        headers = new Headers({
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
            }
        }));
        
    } else {
        console.error("JWT token not found in cookie");
        window.location.href = "/auth/logout";
    }
    const forumSection = document.createElement("section");
    document.body.appendChild(forumSection);
    forumSection.innerHTML = `
    <h2>Forum</h2>
    <div class="forum-posts"></div>
    `;
    const forumPostsContainer = forumSection.querySelector(".forum-posts");


    // Function to load and render forum posts
    function loadForumPosts() {
        forumPostsContainer.innerHTML = '<p>Loading forum posts...</p>';
        fetch("/api/forum/posts", {
        method: "GET",
        headers,
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success && Array.isArray(data.data)) {
            if (data.data.length === 0) {
                forumPostsContainer.innerHTML = '<p>No forum posts yet.</p>';
            } else {
                forumPostsContainer.innerHTML = "";
                data.data.forEach((post) => {
                const postDiv = document.createElement("div");
                postDiv.className = "forum-post";
                postDiv.innerHTML = `
                    <h3>${post.title}</h3>
                    <p><strong>By:</strong> ${post.username}</p>
                    <p>${post.body}</p>
                    <div class="forum-comments" id="forum-comments-${post.post_id}"></div>
                    <form class="new-comment-form" data-post-id="${post.post_id}" style="margin-top:0.5em;">
                    <input type="text" class="comment-body" placeholder="Add a comment..." required style="margin-right:0.5em;">
                    <button type="submit">Comment</button>
                    </form>
                    <hr>
                `;
                postDiv.firstElementChild.id="post"+post.post_id;
                createUserPopup(postDiv.firstElementChild, post, true);
                forumPostsContainer.appendChild(postDiv);
                loadCommentsForPost(post.post_id);
                // Add event listener for new comment form
                const commentForm = postDiv.querySelector(".new-comment-form");
                commentForm.addEventListener("submit", function (e) {
                    e.preventDefault();
                    const commentBody = commentForm.querySelector(".comment-body").value.trim();
                    if (!commentBody) return;
                    fetch(`/api/forum/posts/${post.post_id}/comments`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ body: commentBody }),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                        commentForm.querySelector(".comment-body").value = "";
                        loadCommentsForPost(post.post_id);
                        } else {
                        alert("Failed to add comment.");
                        }
                    })
                    .catch(() => alert("Error adding comment."));
                });
                });
            }
            } else {
            forumPostsContainer.innerHTML = '<p>Failed to load forum posts.</p>';
            }
        })
        .catch((err) => {
            console.log(err);
            forumPostsContainer.innerHTML = '<p>Error loading forum posts.</p>';
        });
  }

  // Function to load and render comments for a post
  function loadCommentsForPost(postId) {
    const commentsDiv = document.getElementById(`forum-comments-${postId}`);
    if (!commentsDiv) return;
    commentsDiv.innerHTML = '<em>Loading comments...</em>';
    fetch(`/api/forum/posts/${postId}/comments`, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          if (data.data.length === 0) {
            commentsDiv.innerHTML = '<em>No comments yet.</em>';
          } else {
            commentsDiv.innerHTML="";
            data.data.forEach((comment) => {
              var commentDiv = document.createElement("div");
              commentDiv.className = "forum-comment";
              commentDiv.id = "comment"+comment.comment_id;
              commentDiv.innerHTML = `<strong>${comment.username || comment.user_id || "User"}:</strong> ${comment.body}`;
              createUserPopup(commentDiv, comment, false);
              commentsDiv.appendChild(commentDiv);
            });
          }
        } else {
          commentsDiv.innerHTML = '<em>Failed to load comments.</em>';
        }
      })
      .catch(() => {
        commentsDiv.innerHTML = '<em>Error loading comments.</em>';
      });
  }

  // Initial load
  loadForumPosts();
});
