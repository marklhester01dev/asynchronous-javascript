const getUserProfile = async () => {
  try {
    const fetchUserData = await fetch(
      "https://jsonplaceholder.typicode.com/users/",
    );

    if (fetchUserData.status === 404 || !fetchUserData.ok) {
      throw new Error("There's a problem with the server. Try again later");
    }

    const userData = await fetchUserData.json();

    console.log(userData);

    userData.forEach((data) => {
      if (data.id) {
        console.log(data.address.street);
      }
    });
  } catch (err) {
    console.log("Error: ", err.message);
  }
};

console.log(getUserProfile());
