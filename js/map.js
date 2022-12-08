var map = L.map('map').setView([48.8411199,2.5884038], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var select_departements=document.getElementById("select_departements");
select_departements.length=0;
var defaultOption = document.createElement('option');
defaultOption.text = 'Choix du département';

select_departements.add(defaultOption);
select_departements.selectedIndex=0;

fetch('json/depart.json')
.then(
  function(response) {  
    if (response.status !== 200) {  
      console.log('Error Status Code: ' + 
        response.status);  
      return;  
    }

    response.json().then(function(data) {  
      let option;
  
    for (let i = 0; i < data.length; i++) {
        option = document.createElement('option');
        option.text = data[i].dep_name;
        // option.text = data[i].abbreviation;
        select_departements.add(option);
    }
  })
  }
)
