<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
    integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
    crossorigin=""/>
     <!-- Make sure you put this AFTER Leaflet's CSS -->
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
    integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
    crossorigin=""></script>
    <link rel="stylesheet" href="css/map.css"> 
    <meta charset="UTF-8">
    <title>Décès – timeline circulaire par mois – le client Leaflet</title>
</head>
<body>
    <div id="entete">
		<h1>Décès – timeline circulaire par mois – le client Leaflet</h1>
    </div>
    <div id="map"></div>
    <form method="post" action="#" id="recherche">
    <div id="select">Sélèction 
        <p><select id="select_departements">
        </select></p>
        <p><select id="select_stat">
            <option>---</option>
        </select></p>
    </div>
</form>
    <script src="js/map.js"></script>
</body>
</html>