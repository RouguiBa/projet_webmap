
            // ####################################################### //
                            // Créer la carte Leaflet //
            // ####################################################### //
 
var map = L.map('map').setView( [46.227638, 2.213749], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

            // ####################################################### //
                                // Variables //
            // ####################################################### //

var select_stat = document.getElementById("select_stat");
var defaultOption_depart = document.createElement('option');
var button = document.getElementById("button");
var formulaire = document.getElementById("recherche");
var data_json = {};
var layers_geojson1 = [];
var layers_geojson2 = [];
var choix;

            // ####################################################### //
                        // Ajouter le GeoJSON des départements //
            // ####################################################### //

function ajout_geojson(){
    /**
     * Cette fonction ne prend pas d'argument en entrée et ne renvoie rien. 
     * Elle est utilisée pour charger un fichier GeoJSON contenant des données géographiques sur les départements français 
     * et les ajouter à la carte Leaflet.
    */
    fetch("geojson/departements.geojson")
    .then(response => response.json())
    .then(response => {
        for (var i = 0; i < 12; i++) {
            var layer1 = L.geoJson(response, {
                style: getStyle1(i),
                onEachFeature: evenement1
            });
            layers_geojson1.push(layer1); // On stocke la couche crée pour la statistique "Décès moyen par mois"

            var layer2 = L.geoJson(response, {
                style: getStyle2(i),
                onEachFeature: evenement2
            });
            layers_geojson2.push(layer2); // On stocke la couche crée pour la statistique "Age<10ans"
        }
    });
}

            // ####################################################### //
// Récupérer les statistiques présent dans le fichier Json et les ajouter dans le select //
            // ####################################################### //

fetch('json/depart.json')
.then(function(response) {
if (response.status !== 200) {
console.log('Error Status Code: ' + response.status);
return;
}
response.json().then(function(data) {
data_json = data;
defaultOption_depart.text = 'Choix des statistiques';
select_stat.add(defaultOption_depart);
select_stat.selectedIndex = 0;
for (let i = 0; i < data[1].statistiques.length; i++) {
var option = document.createElement('option');
option.text = data[1].statistiques[i].nom;
select_stat.add(option);
}
})
});

            // ####################################################### //
    // Ecouter le change sur le select puis lancer les fonction pour l'ANIMATION //
            // ####################################################### //

select_stat.addEventListener("change", startChoroplethAnimation);
select_stat.addEventListener("change",startTimelineAnimation)

function startChoroplethAnimation() {
    /**
     * Cette fonction prend en entrée aucun paramètre explicite mais utilise des variables globales 
     * telles que choix_stat, choix, layers_geojson1, layers_geojson2 et data_json. Cette fonction ne renvoie rien.
     * Dans cette fonction, on récupère la valeur de l'option sélectionnée (choix_stat) et on la stocke dans la variable choix. 
     * Ensuite, on vérifie la valeur de choix_stat et on appelle la fonction animateChoropleths() avec l'un des tableaux 
     * layers_geojson1 ou layers_geojson2 en fonction de la valeur de choix_stat. 
     * Cette fonction anime les départements sur la carte en utilisant des couleurs différentes en fonction des
     *  données de chaque département.
     * On met également à jour le contenu de élément texte1 avec la description de la statistique sélectionnée à 
     * partir des données JSON dans la variable data_json.
    */
var choix_stat = select_stat.options[select_stat.selectedIndex].text
choix = choix_stat;
if (choix_stat === "Décès moyen du mois") {
    animateChoropleths(layers_geojson1);
    texte1.update(data_json[1].statistiques[0].description)
}
if (choix_stat === "Age<10ans") {
    animateChoropleths(layers_geojson2);
    texte1.update(data_json[1].statistiques[1].description)
}

ajout_geojson(); // On appelle la fonction pour ajouter les couches qu'à cette étape, c'est à dire aprè le choix de la statistique
}

var interval;
var intervals_timeline = [];

function startTimelineAnimation(event) {
    /**
     * Cette fonction prend un paramètre event qui représente l'événement déclencheur. Cette fonction ne renvoie rien.
     * Dans cette fonction, on commence par vérifier si une statistique a été sélectionnée (choix) 
     * et si elle est différente de la valeur par défaut ("Choix des statistiques"). 
     * Si c'est le cas, on efface toutes les intervalles précédentes en appelant clearInterval(interval) et on démarre un nouvel 
     * intervalle avec la fonction setInterval() qui anime les mois de l'année sur la timeline. 
     * Cette animation est effectuée en ajoutant la classe CSS active à l'élément correspondant à chaque mois, 
     * et en la supprimant des autres éléments. L'intervalle ID est ajouté à un tableau intervals_timeline pour pouvoir 
     * le supprimer plus tard si nécessaire.
     * Si aucune statistique n'a été sélectionnée, on met à jour le contenu de l'élément HTML texte1 pour demander 
     * à l'utilisateur de sélectionner une statistique.
    */
event.preventDefault();
if(choix && choix != "Choix des statistiques"){
    clearInterval(interval);

var months = document.querySelectorAll('.month');
var monthIndex = 0;

interval = setInterval(function () {
    months.forEach(function (month, index) {
    if (index === monthIndex) {
        month.classList.add('active');
    } else {
        month.classList.remove('active');
    }
    });

    monthIndex = (monthIndex + 1) % months.length;
}, 1000);

// Add interval ID to array
intervals_timeline.push(interval);
}else{
    texte1.update("Veuillez d'abord choisir une statistique")
}

}

            // ####################################################### //
                        // Obtenir le style pour chaque mois //
            // ####################################################### //
            
function getStyle1(month) {
    /**
     * Cette fonction prend en entrée un argument month qui représente le mois pour lequel on veut obtenir 
     * le style pour chaque département. Elle utilise ensuite la variable globale data_json pour récupérer 
     * les données des départements et les statistiques "Décès moyen du mois" pour le mois donné en argument. 
     * Elle retourne un objet qui représente le style à appliquer pour chaque département.
     * @param {number} month représente le mois pour lequel on veut obtenir le style pour chaque département
    */
return function(feature) {
data_json[0].departement.forEach(element => {
if (element.nom === feature.properties.nom) {
    feature.properties.code=element.statistiques[0][month];
}
});
return {
fillColor: getColor(feature.properties.code),
weight: 2,
opacity: 1,
color: 'white',
fillOpacity: 0.7
};
}
}
function getStyle2(month) {
    /**
     * Cette fonction prend en entrée un argument month qui représente le mois pour lequel on veut obtenir 
     * le style pour chaque département. Elle utilise ensuite la variable globale data_json pour récupérer 
     * les données des départements et les statistiques "Age<10ans" pour le mois donné en argument. 
     * Elle retourne un objet qui représente le style à appliquer pour chaque département.
     * @param {number} month représente le mois pour lequel on veut obtenir le style pour chaque département
    */
    return function(feature) {
    data_json[0].departement.forEach(element => {
    if (element.nom === feature.properties.nom) {
       feature.properties.code=element.statistiques[1][month];
    }
    });
    return {
    fillColor: getColor(feature.properties.code),
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
    };
    }
    }
            // ####################################################### //
                    // Obtenir la couleur pour chaque statistique //
            // ####################################################### //
            
function getColor(d) {
    /**
     * Cette fonction prend en entrée une valeur d qui représente une statistique d'un département pour un mois donné 
     * et retourne une couleur en fonction de cette valeur. Plus la valeur est élevée, plus la couleur sera foncée.
     * @param {number} d eprésente une statistique d'un département pour un mois donné
    */
return d > 1 ? '#800026' :
d > 0.8 ? '#BD0026' :
d > 0.6 ? '#E31A1C' :
d > 0.4 ? '#FC4E2A' :
d > 0.2 ? '#FD8D3C' :
'#FFEDA0';
}

function evenement1(feature, layer){
    /**
     * Cette fonction est appelé dans l'option "onEachFeature" lors de la création des couches GeoJson.
     * utilisées pour ajouter des événements de la souris aux couches GeoJson créé pour la statistique "Décès moyen du mois"
     * @param {GeoJSON} feature correspond aux features de la couche GeoJson
     * @param {ILayer} layer correspond à la couche GeoJson
    */
    layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight1,
    });
    }
function evenement2(feature, layer){
    /**
     * Cette fonction est appelé dans l'option "onEachFeature" lors de la création des couches GeoJson.
     * utilisées pour ajouter des événements de la souris aux couches GeoJson créé pour la statistique "Age<10ans"
     * @param {GeoJSON} feature correspond aux features de la couche GeoJson
     * @param {ILayer} layer correspond à la couche GeoJson
    */
    layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight2,
    });
    }

function highlightFeature(e) {
    /**
     *  Cette fonction est appelée dans les fonctions evenement 1 et 2 lorsqu'un utilisateur survole 
     * une des couches GeoJson avec la souris, elle met en évidence cette couche en augmentant son épaisseur
     *  et en modifiant sa couleur.
     * @param {evenement} e 
    */
var layer = e.target;
layer.setStyle({
weight: 5,
color: '#666',
dashArray: '',
fillOpacity: 0.7
});
if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
layer.bringToFront();
}

info.update(layer.feature.properties.nom );
}

function resetHighlight1(e) {
    /**
     * Cette fonction est appelé dans l'evenement 1.
     * Lorsque la souris quitte la zone de la couche, 
     * elles réinitialisent le style de toutes les couches géographiques à leur état par défaut.
     * @param {evenement} e
    */
for(i=0;i<layers_geojson1.length;i++){
layers_geojson1[i].setStyle({
weight: 2,
opacity: 1,
color: 'white',
dashArray: '',
fillOpacity: 0.7
});
}
info.update('Choisir un département');
}
function resetHighlight2(e) {
    /**
     * Cette fonction est appelé dans l'evenement 2.
     * Lorsque la souris quitte la zone de la couche, 
     * elles réinitialisent le style de toutes les couches géographiques à leur état par défaut.
     * @param {evenement} e
    */
    for(i=0;i<layers_geojson2.length;i++){
    layers_geojson2[i].setStyle({
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '',
    fillOpacity: 0.7
    });
    }
    info.update('Choisir un département');
}
    
            // ####################################################### //
//Ajouter les noms des département sur lesquels on passe la souris sur la carte //
            // ####################################################### //

var info = L.control({position: 'topleft'});

info.onAdd = function (map) {
this._div = L.DomUtil.create('div', 'info');
this.update();
return this._div;
};

info.update = function (props) {
this._div.innerHTML = '<h4>Département</h4>' + (props ?
'<b>' + props + '</b><br />'
: 'Passez la souris sur la carte');
};

info.addTo(map);


            // ####################################################### //
                //Ajouter description de la statistique sur la carte //
            // ####################################################### //

var texte1 = L.control({position: 'topright'});

texte1.onAdd = function (map) {
this._div = L.DomUtil.create('div', 'texte1');
this.update();
return this._div;
};

texte1.update = function (props) {
this._div.innerHTML =(props ?
'<b>' + props + '</b><br />'
: 'Information sur la statistique affichée');
};

texte1.addTo(map);

            // ####################################################### //
                        // Ajouter légende sur la carte //
            // ####################################################### //

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend'), //Création d'une balise div
    seuils = [0.2, 0.4, 0.6, 0.8, 1], //Definition des seuils
    labels = [];
    div.innerHTML +="Statistiques<br>"; //Titre
// Boucle sur les seuils établis et création d'une etiquette et d'un carré de couleur.
for (var i = 0; i < seuils.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColor(seuils[i]) + '"></i> ]' +
    seuils[i] + (seuils[i + 1] ? ' &ndash; ' + seuils[i + 1] + '] <br>' :'');
}

return div;
};
legend.addTo(map);


            // ####################################################### //
                        // Fonction pour animer les choroplèthes //
            // ####################################################### //
                    
var intervalID=null;
var intervals_choropleth = [];

function animateChoropleths(layers_geojson) {
    /**
     * Cette fonction affiches les couches choroplethes sur la carte à intervalles réguliers (toutes les secondes) 
     * en affichant les données pour chaque mois de l'année.
     * @param {liste} layers_geojson contient des couches de données géographiques au format GeoJSON
    */
    clearInterval(intervalID);
    month = 1;
    intervalID = setInterval(function () {
        // Retirer les couches précédentes de la carte
        for (i = 0; i < layers_geojson.length; i++) {
            map.removeLayer(layers_geojson[i]);
        }
        // Ajouter la couche de données correspondant au mois actuel à la carte
        layers_geojson[month-1].addTo(map);
        // Passer au mois suivant, ou revenir à 1 si on est en décembre
        month = (month % 12) + 1;

    }, 1000);
    intervals_choropleth.push(intervalID);
}

            // ####################################################### //
//Gestionnaires d'événements pour les boutons de démarrage et d'arrêt de l'animation. //
            // ####################################################### //


function stopTimeline(event) {
    /**
     * Cette fonction est un gestionnaire d'événements qui arrête l'animation de la timeline 
     * lorsqu'un événement de clic se produit sur le bouton stop
     * @param {evenement} event 
    */
    event.preventDefault();
  // Clear all intervals
  clearIntervals(intervals_timeline);
}
function stopanimationmap(event) {
    /**
     * Cette fonction est un gestionnaire d'événements qui arrête l'animation de la carte 
     * choroplethe lorsqu'un événement de clic se produit sur le bouton stop
     * @param {evenement} event 
    */
    event.preventDefault();
  // Clear all intervals
  clearIntervals(intervals_choropleth);
}

function clearIntervals(intervals) {
     /**
     * Cette fonction clearIntervals prend en entrée un tableau intervals 
     * contenant les identifiants d'intervalle et arrête tous les intervalles de temps qu'il contient.
     * @param {liste} intervals contient les identifiants d'intervalle
     */
  intervals.forEach(function (interval) {
    clearInterval(interval);
  });
  intervals = [];
}

function start_choropleth(event) {
    /**
     * Cette fonction est un gestionnaire d'événements qui commence l'animation de la carte 
     * choroplethe lorsqu'un événement de clic se produit sur le bouton start
     * Cette fonction n'est lancée que lorsqu'on a choisi une statistique sinon
     * elle affiche sur la carte une phrase demandant à l'utilisateur de choisir une statistique.
     * @param {evenement} event 
    */
    event.preventDefault();
    if(choix && choix != "Choix des statistiques"){
        if(choix==="Age<10ans"){
            animateChoropleths(layers_geojson2);
        }else{
            animateChoropleths(layers_geojson1);
        }
    }
}

document.getElementById('startButton').addEventListener('click', startTimelineAnimation);
document.getElementById('startButton').addEventListener('click', start_choropleth);
document.getElementById('stopButton').addEventListener('click', stopTimeline);
document.getElementById('stopButton').addEventListener('click', stopanimationmap);