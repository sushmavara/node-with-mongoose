const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    // We can write to the response wether it needs to be html xml json etc using write and once all the writes are done we need to call res.end() to indicate the write has done

    res.setHeader("Content-type", "text/html");
    res.write("<html>");
    res.write("<head><title>My Page</title></head>");
    res.write(
      "<body><h4>Home Page2</h4><form action=/input method=POST><input name=userInput type=text /><button>Submit</button></form></body>"
    );
    res.write("</html>");
    res.end();
    return;
  }

  if (url === "/input" && method === "POST") {
    // ? Since we know in the request we have some user input from the form - but all these user input are comes in streams or buffers - they are not available instantly - So we need to use event listeners on "data" and "end" and use callbacks to read in buffer streams and to handle the input

    // To read the data from the request - we need to add a event listener on "data" and to finally read all the data we need to add event listner to "end"

    //?  We use .on to add a event listener - event listner takes 2 prop
    //?  1. event
    //?  2. callback

    // and we need to store the data coming in buffers on "data" event listner

    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString(); // ? We Buffer core module here and use tostring to convert it to actual data
      const data = parsedBody.split("=")[0];

      // We also have writeFileSync - but this will block the process as it does synchronous action
      // on the other hand writeFile is async and uses worker pool for the heavy lifting and uses callback which is triggered
      // after the write is complete

      fs.writeFile("input.txt", data, () => {
        res.statusCode = 302; // redirection
        res.setHeader("location", "/"); // setting redirection location
        res.end();
      });
    });

    return;
  }

  res.setHeader("Content-type", "text/html");
  res.write("<html>");
  res.write(
    "<head><title>My Page</title></head><body><h4>Home Page</h4></body>"
  );
  res.write("</html>");
  res.end();
  return;
};

module.exports = {
  requestHandler: requestHandler,
};
