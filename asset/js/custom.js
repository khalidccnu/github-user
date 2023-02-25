// check username valid or not
let isValid = username => {
    if (username.trim() === "" || !username.charAt(0).match(/[a-z]/)) {
        document.querySelector("#search-warning").classList.remove("d-none");

        return false;
    } else {
        document.querySelector("#search-warning").classList.add("d-none");

        return true;
    }
}

// check user exist or not
let isExist = obj => {
    if (obj.message === "Not Found") return false;
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
    let userArea = document.querySelector("#user .container");
    let userCard = document.createElement("div");
    let date = new Date(user.created_at);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
                        <h5 class="card-title mb-0">${user.name}</h5>
                        <small>${user.login}</small>
                    </div>
                    <div>Joined ${date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()}</div>
                </div>
                <p class="card-text mt-3">${user.bio}</p>
                <div class="card bg-secondary-subtle">
                    <div class="card-body">
                        <ul class="list-unstyled d-flex justify-content-around">
                            <li class="d-flex flex-column fw-bold">
                                <span>Repos</span>
                                <span class="fs-5">${user.public_repos}</span>
                            </li>
                            <li class="d-flex flex-column fw-bold">
                                <span>Followers</span>
                                <span class="fs-5">${user.followers}</span>
                            </li>
                            <li class="d-flex flex-column fw-bold">
                                <span>Following</span>
                                <span class="fs-5">${user.following}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12 col-sm-6">
                        <i class='bx bx-location-plus'></i>
                        <span>${user.location}</span>
                    </div>
                    <div class="col-12 col-sm-6">
                        <i class='bx bxl-twitter'></i>
                        <span>${user.twitter_username}</span>
                    </div>
                    <div class="col-12 col-sm-6">
                        <i class='bx bx-link'></i>
                        <span>${user.blog}</span>
                    </div>
                    <div class="col-12 col-sm-6">
                        <i class='bx bx-building'></i>
                        <span>${user.company}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    userArea.innerHTML = "";
    userArea.appendChild(userCard);
}

// search user
document.getElementById("search-form").addEventListener("submit", async e => {
    e.preventDefault();

    let username = document.getElementById("username").value.toLowerCase();
    let validUsername = isValid(username);
    if(validUsername === false) return false;

    let obj;
    await getUserDetails(username).then(result => obj = result);
    if (obj === false) return false;

    displayUser(obj);
});