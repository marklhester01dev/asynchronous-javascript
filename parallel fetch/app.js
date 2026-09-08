const getDashboardData = async (userId) => {
  try {
    // Both calls are independent — neither needs the other's result
    const [userRes, announcementsRes] = await Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
      fetch(`https://jsonplaceholder.typicode.com/posts/1`), // stand-in for "site announcements"
    ]);

    if (!userRes.ok || !announcementsRes.ok)
      throw new Error("One or more requests failed");

    const [user, announcement] = await Promise.all([
      userRes.json(),
      announcementsRes.json(),
    ]);

    console.log("User:", user.name);
    console.log("Announcement:", announcement.title);

    return { user, announcement };
  } catch (err) {
    console.log("Error:", err.message);
  }
};

getDashboardData(1);
