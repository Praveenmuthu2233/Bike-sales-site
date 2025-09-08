let modal = document.getElementById("exampleModal");

let db;
let dataBase = indexedDB.open("BikeEnquiry", 1);

dataBase.onupgradeneeded = function (event) {
  db = event.target.result;
  db.createObjectStore("customerEnquiries", { keyPath: "id", autoIncrement: true });
};
dataBase.onsuccess = function (event) {
  db = event.target.result;
};


fetch("galary.dp")
  .then(response => response.json())
  .then(data => {
    let bikeData = data;
    let output = '';
    
    bikeData.forEach(bike => {
      output += `
        <div class="col-12 col-md-6 col-lg-3 text-center hover-img">
          <img src="${bike.imageUrl}" alt="${bike.bikeName}" class="category-pic">
          <h5 class="mt-3">${bike.bikeName}</h5>
        </div>
      `;
    });

    document.getElementById("category-page-details").innerHTML = output;
  }
)

let userInputName = document.getElementById("user-input-name");
userInputName.addEventListener("input", function() {
  let errorCheck = userInputName.parentElement.querySelector("p.error-message");
  if (errorCheck) {
    errorCheck.remove();
  }
  if (!/^[a-zA-Z\s]*$/.test(userInputName.value)) {
    let errorPara = document.createElement("p");
    errorPara.textContent = "Invalid input";
    errorPara.style.color = "red";
    errorPara.classList.add("error-message");
    userInputName.parentElement.appendChild(errorPara);
  }
});


let userInputNumber = document.getElementById("user-input-number");
userInputNumber.addEventListener("input", function() {
  let errorCheck = userInputNumber.parentElement.querySelector("p.error-message");
  if (errorCheck) errorCheck.remove();

  if (!/^(?:\+91)?[6-9]\d{9}$/.test(userInputNumber.value)) {
    let errorPara = document.createElement("p");
    errorPara.textContent = "Invalid Number";
    errorPara.style.color = "red";
    errorPara.classList.add("error-message");
    userInputNumber.parentElement.appendChild(errorPara);
  }
    
});

let cancelBtn = document.getElementById("cancel-Click");
cancelBtn.addEventListener("click", function() {
    userInputName.value = "";
    userInputNumber.value = "";

    let errorCheck = userInputName.parentElement.querySelector("p.error-message");
    let errorCheckNum = userInputNumber.parentElement.querySelector("p.number-message");
    if (errorCheck) {
        errorCheck.style.display = "none";
    }else{
        modal.style.display = "none"; 
    }
    if (errorCheckNum) {
        errorCheckNum.style.display = "none";
    }else{
    modal.style.display = "none";
    } 
});

let pageItems = document.getElementsByClassName("page-item");

let bikeData = [];
let currentPageNo = 1;
let totalImgPerPage = 8;
let selectedBikeId = null;
fetch("data.dp")
  .then(response => response.json())
  .then(data => {
    bikeData = data;

    paginationCout();
    bikeData.forEach((bike, index) => {
      bike.primaryKey = index;
    });
    pageEvent(currentPageNo);
  }
)

function paginationCout(){
  let navOutput = '';
  let navCount = Math.ceil(bikeData.length / totalImgPerPage);
  
  for (let i = 1; i <= navCount; i++) {
    if(i == 1){
      navOutput += `<li class="page-item active" onclick="pagination(event, ${i})"><a class="page-link" href="#Product">${i}</a></li>`;
      document.getElementById("pagination-count").innerHTML = navOutput;
    }else{
      navOutput += `<li class="page-item" onclick="pagination(event, ${i})"><a class="page-link" href="#Product">${i}</a></li>`;
      document.getElementById("pagination-count").innerHTML = navOutput;
    }
  }
}


function pagination(event,n) {
  currentPageNo = n;
  for (let i = 0; i < pageItems.length; i++) {
    pageItems[i].classList.remove("active");
  }
  event.currentTarget.classList.add("active");
  
  pageEvent(currentPageNo);
  
}

function pageEvent(pageNumber){
  let start = (pageNumber - 1) * totalImgPerPage;
  let end = start + totalImgPerPage;
  let bikeShow = bikeData.slice(start, end);
  let output = "";
  for (let i = 0; i < bikeShow.length; i++) {
    let bike = bikeShow[i];
    output += `
      <div class="col-12 col-md-4 col-lg-3 text-center">
        <img src="${bike.image}" alt="${bike.name}" class="pic w-100">
        <h3 class="mt-2 bikeName">${bike.name}</h3>
        <button onclick="setSelectedBikeId(${bike.primaryKey})" type="button" class="btnClick btn" 
          data-bs-toggle="modal" data-bs-target="#exampleModal">
            <i class="fas fa-envelope mr-2"></i>
            <span class="ps-2 hover-btn">Enquiry</span>
        </button>
        
      </div>`;
  };
  document.getElementById("bikeRow").innerHTML = output;
  currentPageNo += 6;
}

let formName = document.getElementsByClassName("form-name");
formName.addEventListener("input", function(event) {
  let errorCheck = formName.parentElement.querySelector("p.error-message");
  if(errorCheck) {
    errorCheck.remove();
  }

  if (!(event.key)) {
    let errorPara = document.createElement("p");
    errorPara.textContent = "Invalid input";
    errorPara.style.color = "red";
    errorPara.classList.add("error-message");
    formName.parentElement.appendChild(errorPara);
  }
});
function isTrue(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

let formNumber = document.getElementsByClassName("form-number");
let fNum = /^(0|91)?[6-9][0-9]{9}$/;
formNumber.addEventListener("input", function() {
    let errorMsg = formNumber.parentElement.querySelector("p.number-error");
    if (errorMsg) errorMsg.remove();

  if (!fNum.test(formNumber.value)) {
    let errorPara = document.createElement("p");
    errorPara.textContent = "Invalid input";
    errorPara.style.color = "red";
    errorPara.classList.add("error-message");
    formNumber.parentElement.appendChild(errorPara);
  }
});

function setSelectedBikeId(n){
  selectedBikeId = n;
}

function submitUserForm() {
  let userInputName = document.getElementById("user-input-name");
  let userInputNumber = document.getElementById("user-input-number");
  let userInputLocation = document.getElementById("user-input-location");

  let formNameValue = userInputName.value;
  let formNumberValue = userInputNumber.value;
  let locationValue = userInputLocation.value;

  //let selectedBike = bikeData.find(bike => bike.primaryKey === selectedBikeId);
  //let selectedBike = enquiries.get(selectedBikeId);
  
  let selectedBike = bikeData[selectedBikeId];

  let newUserDetails = {
    selectedBike : selectedBike.primaryKey,
    bikeName: selectedBike.name,
    name: formNameValue,
    number: formNumberValue,
    location: locationValue
  };

  let transaction = db.transaction(["customerEnquiries"], "readwrite");
  let store = transaction.objectStore("customerEnquiries");
  store.add(newUserDetails);
  
  userInputName.value = '';
  userInputNumber.value = '';
  userInputLocation.value = '';
  submitData(); 

  let modalInstance = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
  modalInstance.hide();

}
function submitData() {
  let transaction = db.transaction(["customerEnquiries"], "readonly");
  let store = transaction.objectStore("customerEnquiries");
  let request = store.getAll();

  request.onsuccess = function () {
    let storedUserDetails = request.result;
    let dideclaredData = {};

    storedUserDetails.forEach((user) => {
      let number = user.number || "No number stored";
      if (!dideclaredData[number]) {
        dideclaredData[number] = {
          name: user.name || "No name stored",
          location: user.location || "No location stored",
          bikes: [],
        };
      }
      dideclaredData[number].bikes.push(user.bikeName);
    });

    let enquiryOutput = "";

    for (let number in dideclaredData) {
      let { name, location, bikes } = dideclaredData[number];
      let bikeList = bikes.join(", ");

      enquiryOutput += `
        <div class="col-12 col-md-4 col-lg-3 adminContainer">
          <div class="m-4">
            <h5>Bike Name: ${bikeList}</h5>
            <h5>Customer Name: ${name}</h5>
            <p>Customer Number: ${number}</p>
            <p>Customer Location: ${location}</p>
          </div>
        </div>`;
    }

    document.getElementById("userEnquiry").innerHTML = enquiryOutput;
  };
}


