"use strict";

const yourLocation = document.getElementById("locate-app");
const locateBtn = document.getElementById("locate-btn");
const latitude = document.createElement("p");
const longitude = document.createElement("p");
const errorMsg = document.createElement("span");

yourLocation.append(latitude, longitude, errorMsg);

const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        latitude.textContent = `Latitude: ${lat}`;
        longitude.textContent = `Longitude: ${lon}`;
        errorMsg.textContent = "";
        resolve(position.coords);
      },
      (error) => {
        errorMsg.textContent = `Failed to get location: ${error.message}`;
        reject(error);
      },
    );
  });
};

locateBtn.addEventListener("click", async () => {
  try {
    const coords = await getPosition();
    console.log(coords);
  } catch (err) {
    console.log("Error caught:", err.message);
  }
});
