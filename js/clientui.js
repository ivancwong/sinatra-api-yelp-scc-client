function calculateRoute(from, to) {
    // Get travel mode
    var selectedMode = document.getElementById('mode').value;

    // Center initialized to Haight, San Francisco
    var myOptions = {
        zoom: 10,
        center: new google.maps.LatLng(37.77, -122.447),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Draw the map
    var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);

    var directionsService = new google.maps.DirectionsService();
    var directionsRequest = {
        origin: from,
        // destination: to,
        destination: {lat: 37.77, lng: -122.447},  // Haight, San Francisco

        //travelMode: google.maps.DirectionsTravelMode.DRIVING,
        travelMode: google.maps.TravelMode[selectedMode],
        unitSystem: google.maps.UnitSystem.METRIC
    };
    directionsService.route(
        directionsRequest,
        function(response, status)
        {
            if (status == google.maps.DirectionsStatus.OK)
            {
                new google.maps.DirectionsRenderer({
                    map: mapObject,
                    directions: response
                });
            }
            else
                $("#error").append("Unable to retrieve your route.  Use the Get my posistion link.<br />");
        }
    );
}


$(document).ready(function() {
    // If the browser supports the Geolocation API
    if (typeof navigator.geolocation == "undefined") {
        $("#error").text("Your browser doesn't support the Geolocation API");
        return;
    }

    $("#from-link, #to-link").click(function(event) {
        event.preventDefault();
        var addressId = this.id.substring(0, this.id.indexOf("-"));

        navigator.geolocation.getCurrentPosition(function(position) {
                var geocoder = new google.maps.Geocoder();
                // Ivan Added code to display the Lat and Long
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                var div = document.getElementById( 'geoUserlocation' );
                div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
                // Ivan Addeded coded ended

                geocoder.geocode({
                        "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                    },
                    function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK)

                            $("#" + addressId).val(results[0].formatted_address);

                        else
                            $("#error").append("Unable to retrieve your address<br />");
                    });
            },
            function(positionError){
                $("#error").append("Error: " + positionError.message + "<br />");
            },
            {
                enableHighAccuracy: true,
                timeout: 10 * 1000 // 10 seconds
            });
    });

    $("#calculate-route").submit(function(event) {
        event.preventDefault();
        calculateRoute($("#from").val(), $("#to").val());
    });

    document.getElementById('mode').addEventListener('change', function() {
        calculateRoute($("#from").val(), $("#to").val());
    });
});
