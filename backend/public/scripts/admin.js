import { getCookie } from "./getCookie.js"

window.addEventListener("load", () => {
    // Get the JWT token from the cookie
    const jwt = getCookie("jwt");
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
                }
        }));
        
    } else {
        console.error("JWT token not found in cookie");
        window.location.href = "/auth/logout";
    }
});