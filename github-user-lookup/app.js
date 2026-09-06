const profile = document.getElementById("profile");
const repoList = document.getElementById("repo-list");
const userName = document.getElementById("username-input");
const searchBtn = document.getElementById("lookup-btn");
let startingIndex = 0;
let endingIndex = 5;

const gitHubUserProfile = async () => {
  const usernameTrimmed = userName.value.trim();

  if (!usernameTrimmed) {
    profile.textContent = "Username Invalid. Try again";
    profile.className = "error";
    return;
  }

  try {
    const fetchUserInfo = await fetch(
      `https://api.github.com/users/${usernameTrimmed}`,
    );

    if (fetchUserInfo.status === 404 || !fetchUserInfo.ok) {
      throw new Error("User Info Request Failed");
    }

    const userData = await fetchUserInfo.json();
    renderUserData(userData, usernameTrimmed);
  } catch (err) {
    profile.textContent =
      "There was a problem getting the info. Try again later.";
    profile.className = "error";
    console.error(
      "There was a problem getting the info. Try again later.",
      err,
    );
  }

  //second try catch block: why? what if the repo fetching fail? it should have it's own separate error from the profile, because if we put it in the first try catch block and there's an error in fetching the repos it will show the error and overwrite the profile fetch result which is not what we want.
  try {
    const fetchRepos = await fetch(
      `https://api.github.com/users/${usernameTrimmed}/repos`,
    );

    if (fetchRepos.status === 404 || !fetchRepos.ok) {
      throw new Error("Repositories Request Failed");
    }

    const repoData = await fetchRepos.json();
    console.log(repoData);
    renderUserRepos(repoData);
  } catch (err) {
    repoList.textContent = "Couldn't load repos. Try again.";
    repoList.className = "error";
    console.error("Couldn't load repos. Try again.", err);
  }
};

function renderUserData(userData, usernameTrimmed) {
  const linkContainer = document.createElement("div");
  const avatarLink = document.createElement("a");
  const avatarImg = document.createElement("img");
  const detailsContainer = document.createElement("div");
  const nameContainer = document.createElement("p");
  const bioContainer = document.createElement("p");
  const publicRepo_count = document.createElement("p");

  avatarLink.href = userData.html_url;
  avatarImg.src = userData.avatar_url;
  avatarImg.alt = "User Avatar";

  avatarLink.appendChild(avatarImg);

  if (userData.name === null) {
    nameContainer.textContent = usernameTrimmed;
  } else {
    nameContainer.textContent = userData.name;
  }

  if (userData.bio === null) {
    bioContainer.textContent = "This user doesn't have any bio yet.";
    bioContainer.className = "grey";
  } else {
    bioContainer.textContent = userData.bio;
    bioContainer.className = "";
  }

  publicRepo_count.textContent = `Public Repositories: ${userData.public_repos}`;

  linkContainer.appendChild(avatarLink);
  detailsContainer.append(nameContainer, bioContainer, publicRepo_count);
  profile.replaceChildren(linkContainer, detailsContainer);
}

function renderUserRepos(repoData) {
  let limitedRepos = repoData.slice(startingIndex, endingIndex);

  const items = limitedRepos.map((repo) => {
    const li = document.createElement("li");
    const link = document.createElement("a");

    link.href = repo.html_url;
    link.textContent = repo.name;

    li.appendChild(link);
    return li;
  });

  repoList.replaceChildren(...items);
  seePreviousRepos(repoData);
  seeMoreRepo(repoData);
}

function seeMoreRepo(repoData) {
  const isLastPage = endingIndex >= repoData.length;

  const fetchBtn = document.createElement("button");
  fetchBtn.textContent = "See more repos";
  fetchBtn.style.display = isLastPage ? "none" : "block";
  repoList.appendChild(fetchBtn);

  fetchBtn.addEventListener("click", () => {
    fetchMoreRepos(repoData);
  });
}

function fetchMoreRepos(repoData) {
  startingIndex += 5;
  endingIndex += 5;

  renderUserRepos(repoData);
}

function seePreviousRepos(repoData) {
  const isFirstPage = startingIndex === 0;

  const backBtn = document.createElement("button");
  backBtn.textContent = "Back";
  backBtn.style.display = isFirstPage ? "none" : "block";
  repoList.appendChild(backBtn);

  backBtn.addEventListener("click", () => {
    backToPreviousList(repoData);
  });
}

function backToPreviousList(repoData) {
  startingIndex -= 5;
  endingIndex -= 5;

  if (startingIndex < 0) {
    startingIndex = 0;
    endingIndex = 5;
  }

  renderUserRepos(repoData);
}

searchBtn.addEventListener("click", gitHubUserProfile);
