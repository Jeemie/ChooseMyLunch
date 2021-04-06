// client-side js, loaded by index.html
// run by the browser each time the page is loaded
// define variables that reference elements on our page

let allFood = new Set();
var businesses;
var finalRest;

async function search(event, form) {
  
  event.preventDefault();
  if (document.getElementById("address").value.length > 10) {
    document.getElementById("addressSearch").style.display = "none";
    document.getElementById("filter").style.display = "block";

    var sel = document.getElementById("radius");

    var add = {
      address: document.getElementById("address").value,
      radius: sel.options[sel.selectedIndex].value
    };

    const body = JSON.stringify(add);

    fetch("/search", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body
    });

    const response = await fetch("/searchAddress");
    const data = await response.json();
    const total = data.total;
    businesses = data.businesses;

    var i;
    var j;
    for (i = 1; i < businesses.length; i++) {
      for (j = 0; j < businesses[i].categories.length; j++) {
        let entry = {
          alias: businesses[i].categories[j].alias,
          title: businesses[i].categories[j].title
        };
        allFood.add(JSON.stringify(entry));
      }
    }
    var sel = document.getElementById("list1");
    for (let item of allFood) {
      let entry = JSON.parse(item);
      //console.log(entry.alias);
      let newOption = new Option(entry.title, entry.alias);
      document.getElementById("list1").add(newOption, undefined);
    }

    sortSelect(document.getElementById("list1"));
  } else {
    alert("Address is too short.");
  }
}

function add() {
  var sel = document.getElementById("list1");
  var selected = sel.options[sel.selectedIndex];
  let newOption = new Option(selected.text, selected.value);
  document.getElementById("list2").add(newOption, undefined);
}

function addAll() {
  var sel = document.getElementById("list1");
  for (let entry of sel.options) {
    let newOption = new Option(entry.text, entry.value);
    document.getElementById("list2").add(newOption, undefined);
  }
}

function remove() {
  var sel = document.getElementById("list2");
  //console.log("Removing " + sel.options[sel.selectedIndex].text + " " + sel.options[sel.selectedIndex].value)

  sel.removeChild(sel.options[sel.selectedIndex]);
}

function removeAll() {
  var sel = document.getElementById("list2");
  while (sel.options.length > 0) {
    sel.options.remove(0);
  }
}

function choose() {
  var chosen = new Set();
  var sel = document.getElementById("list2");
  var i;
  var priceList = document.getElementById("price");
  var price = priceList.options[priceList.selectedIndex].value;

  if (sel.options.length > 0) {
    for (i = 0; i < sel.options.length; i++) {
      var opt = sel.options[i];
      chosen.add(opt.value);
    }

    var eligible = new Array();

    for (let business of businesses) {

      for (let cat of business.categories) {
        if (chosen.has(cat.alias) && (business.price.localeCompare(price) <= 0)) {
          eligible.push(business);
          break;
          }  
      }
    }
    
    var random = Math.floor(Math.random() * Math.floor(eligible.length));

    if(eligible.length <= 0){
      alert("There is nothing within that price range for the categories you've chosen!");
    }else {
      finalRest = eligible[random];


      var address = finalRest.location.address1 +
      " " +
      finalRest.location.city +
      " " +
      finalRest.location.zip_code;

      showFinal();
      
      document.getElementById("pic").src = finalRest.image_url;
      document.getElementById("yelpLink").href = finalRest.url;
      document.getElementById("name").innerHTML = finalRest.name;
      document.getElementById("rating").innerHTML = "Rating : " + finalRest.rating;
      document.getElementById("pricing").innerHTML = "Price Tag : " + finalRest.price;
      document.getElementById("restAddress").innerHTML = address;
      var res = finalRest.name.replace("&", "and");
      document.getElementById("googleLink").href ="https://www.google.com/search?q=" + res + " " + address;
    }
  } else {
    alert("You didn't add anything!");
  }
}

function sortSelect(elem) {
  var tmpAry = [];
  // Retain selected value before sorting
  var selectedValue = elem[elem.selectedIndex].value;
  // Grab all existing entries
  for (var i = 0; i < elem.options.length; i++) tmpAry.push(elem.options[i]);
  // Sort array by text attribute
  tmpAry.sort(function(a, b) {
    return a.text < b.text ? -1 : 1;
  });
  // Wipe out existing elements
  while (elem.options.length > 0) elem.options[0] = null;
  // Restore sorted elements
  var newSelectedIndex = 0;
  for (var i = 0; i < tmpAry.length; i++) {
    elem.options[i] = tmpAry[i];
    if (elem.options[i].value == selectedValue) newSelectedIndex = i;
  }
  elem.selectedIndex = newSelectedIndex; // Set new selected index after sorting
  return;
}

function showFinal(){
      document.getElementById("filter").style.display = "none";
      document.getElementById("final").style.display = "block";
}

function showFilter(){
      document.getElementById("filter").style.display = "block";
      document.getElementById("final").style.display = "none";
}