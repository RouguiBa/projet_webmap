// CRÉATION DE LA CARTE LEAFLET
var map = L.map('map').setView([48.8411199,2.5884038], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// VARIABLES
var select_departements=document.getElementById("select_departements");
var select_stats=document.getElementById("select_stat");
var defaultOption_depart = document.createElement('option');

select_departements.length=0;
defaultOption_depart.text = 'Choix du département';
select_departements.add(defaultOption_depart);
select_departements.selectedIndex=0;

// AJOUT GEOJSON DES DÉPARTEMENT

fetch("geojson/departements.geojson")
.then(response => response.json())
.then(response => {
  L.geoJson(response).addTo(map);
})

//AJOUT DES DÉPARTEMENTS DANS LE SELECT

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

// AJOUT STATISTIQUES DANS LE SELECT

select_departements.addEventListener('change',stat);

function stat(eve){
  eve.preventDefault()
  var defaultOption_stat = document.createElement('option');
  defaultOption_stat.text='Choix des statisques à afficher'
  select_stats.add(defaultOption_stat);
  select_stats.selectedIndex=1;
  fetch('json/stat.json')
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
          option.text = data[i].nom;
          // option.value = data[i].abbreviation;
          select_stats.add(option);
      }
  })
  }
)

}
