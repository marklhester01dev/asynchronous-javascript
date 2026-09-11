const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retryFailedFetch = async () => {
  for (let i = 0; i < 3; i++) {
    try {
      const fetchWebsite = await fetch("https://httpstat.us/500");

      if (!fetchWebsite.ok) {
        throw new Error(
          "There was a problem connecting to the website. Try again later.",
        ); 
      }

      const getData = await fetchWebsite.json();
      console.log(getData);
      return getData; // success — exit immediately, no more retries
    } catch (err) {
      console.log(`Attempt ${i + 1} failed: ${err.message}`);

      if (i === 2) {
        // last attempt already failed — give up for good
        throw new Error("Cannot fetch data after 3 attempts");
      } else {
        // not the last attempt — wait, then let the loop try again
        await sleep(3000);
      }
    }
  }
};

retryFailedFetch();
