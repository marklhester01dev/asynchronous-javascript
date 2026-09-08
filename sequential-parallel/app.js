//Sequential
const commentLists = document.getElementById("comments__list");
const getPostWithComments = async (postID) => {
  const fetchPost = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postID}`,
  );

  if (!fetchPost.ok) {
    throw new Error(
      "An error occurred while fetching the data. Try again later",
    );
  }

  const userData = await fetchPost.json();
  const fetchUserPosts = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${userData.id}`,
  );

  if (!fetchUserPosts.ok) {
    throw new Error("Comment cannot be fetch. Try later");
  }

  const userPost = await fetchUserPosts.json();
  console.log(userPost);
  
  renderUserData(userPost);
};

function renderUserData(userPost) {
  commentLists.innerHTML += userPost.map((data) => {
    return `<li class="comment-details">
      <p>${data.name}</p>
      <p>${data.email}</p>
      <p>${data.body}</p>
    </li>`;
  }).join('');
}

//if block body {} => use return
//if expression body () => no return => results in object literal

getPostWithComments(1);
