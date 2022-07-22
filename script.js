/*
For this functionality, the major work was to load the QR code to the Qr server and
then a response of its content back. Since it's a two-away data flow and we first upload to the API,
hence the use of POST method.
After the response is gotten, it's then displayed on the screen. 
Incase of image upload that are not QR there's a catch block that will deal with the error
*/



// Selecting HTML elements
const wrapper = document.querySelector(".wrapper")
const form = document.querySelector("form")
const fileInp = form.querySelector("input")
const infoText = form.querySelector("p")
const closeBtn = document.querySelector(".close")

// Function for fetching the QR scan request
function fetchRequest(file, formResponse) {
    infoText.innerText = "Scanning QR Code...";
    // Fetching qr code content form the QRserver API (http://api.qrserver.com/v1/read-qr-code/)
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST', body: formResponse
    }).then(res => res.json()).then(d => {
        result = d[0].symbol[0].data;
        infoText.innerText = result ? "Upload QR Code to Scan" : "Couldn't scan QR Code";

        //Return without doing anything if result wasn't fetched
        if(!result) return; 

        // If result fetched then set innerText of textarea to the result
        document.querySelector("textarea").innerText = result;

        //Creating a url for the Qr code scanned
        form.querySelector("img").src = URL.createObjectURL(file);

        wrapper.classList.add("active");
    }).catch(() => { // Catch block
        infoText.innerText = "Couldn't scan QR Code";
    });
}

// Listening to an upload of QR code before taking action
fileInp.addEventListener("change", async e => {
    let file = e.target.files[0];
    if(!file) return;

    // Creating the FormData that will get sent to the API
    let formData = new FormData();

    // Appending the file gotten from the form input to the FormData
    formData.append('file', file);

    // Calling the fetch request function
    fetchRequest(file, formData);

    // Clearing the form after the fetch
    fileInp.value = '';
});

// Adding event listener to the form so that when click, the click will also trigger the click on the form input
// This is neccessary since the form input itself is hidden for easy User xperience
form.addEventListener("click", () => fileInp.click());

closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));