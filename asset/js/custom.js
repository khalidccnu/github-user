let userArea = document.querySelector("#user .container:last-child");

// load spinner
let spinner = isLoad => {
    if (isLoad === true) document.querySelector(".spinner").classList.remove("d-none");
    else document.querySelector(".spinner").classList.add("d-none");
}

// check username valid or not
let isValid = username => {
    if (username.trim() === "" || !username.charAt(0).match(/[a-z]/)) {
        spinner(false);

        document.querySelector("#search-warning").classList.remove("d-none");

        return false;
    } else {
        document.querySelector("#search-warning").classList.add("d-none");

        return true;
    }
}

// check user exist or not
let isExist = obj => {
    userArea.innerHTML = "";

    if (obj.message === "Not Found") {
        let alert = document.createElement("div");

        alert.classList.add("non-exist", "alert", "alert-warning", "mt-4", "mx-auto");
        alert.setAttribute("role", "alert");
        alert.style.maxWidth = "30rem";
        alert.innerText = "No user was found to match your search.";

        spinner(false);
        userArea.appendChild(alert);

        return false;
    } else {
        return true;
    }
}

// get details from user
let getUserDetails = username => {
    return fetch(`https://api.github.com/users/${username}`).then(r => r.json()).then(get => {
        let exist = isExist(get);

        if (exist === false) return false;
        else return get;
    });
}

// display user
let displayUser = user => {
    let date = new Date(user.created_at);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let userCard = document.createElement("div");

    userCard.classList.add("user-card", "card", "mt-4", "mx-auto");
    userCard.innerHTML = `
    <div class="row g-0">
        <div class="col-md-2">
            <div class="ps-3 pt-3">
                <img src="${user.avatar_url}" class="img-user rounded-circle" alt="">
            </div>
        </div>
        <div class="col-md-9 ms-auto">
            <div class="card-body">
                <div class="d-flex flex-column flex-md-row justify-content-between">
                    <div>
                        <h5 class="card-title mb-0">${user.name == null ? "Anonymous" : user.name}</h5>
                        <small class="text-muted">${user.login}</small>
                    </div>
                    <div class="text-dark-emphasis">Joined ${date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()}</div>
                </div>
                <p class="card-text mt-3 text-dark">${user.bio == null ? "Not set yet" : user.bio}</p>
                <div class="card bg-secondary-subtle">
                    <div class="card-body">
                        <ul class="list-unstyled d-flex justify-content-around">
                            <li class="d-flex flex-column">
                                <span class="fw-medium">Repos</span>
                                <span class="fw-bold fs-5">${user.public_repos}</span>
                            </li>
                            <li class="d-flex flex-column">
                                <span class="fw-medium">Followers</span>
                                <span class="fw-bold fs-5">${user.followers}</span>
                            </li>
                            <li class="d-flex flex-column">
                                <span class="fw-medium">Following</span>
                                <span class="fw-bold fs-5">${user.following}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row mt-3 text-dark-emphasis">
                    <div class="col-12 col-sm-6">
                        <i class='bx bx-location-plus'></i>
                        <span>${user.location == null ? "Not set yet" : user.location}</span>
                    </div>
                    <div class="col-12 col-sm-6">
                        <i class='bx bxl-twitter'></i>
                        <span>${user.twitter_username == null ? "Not set yet" : user.twitter_username}</span>
                    </div>
                    <div class="col-12 col-sm-6">
                        <i class='bx bx-link'></i>
                        <span>${user.blog === "" ? "Not set yet" : user.blog}</span>
                    </div>
                    <div class="col-12 col-sm-6">
                        <i class='bx bx-building'></i>
                        <span>${user.company == null ? "Not set yet" : user.company}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    spinner(false);
    userArea.appendChild(userCard);
}

// search user
document.getElementById("search-form").addEventListener("submit", async e => {
    e.preventDefault();
    spinner(true);

    let username = document.getElementById("username").value.toLowerCase();
    let validUsername = isValid(username);
    if(validUsername === false) return false;

    let obj;
    await getUserDetails(username).then(result => obj = result);
    if (obj === false) return false;

    displayUser(obj);
});