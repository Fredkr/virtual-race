<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import polyline  from '@mapbox/polyline';
    const API_KEY = 'process.env.MAPBOX_API_KEY';
    const dispatch = createEventDispatcher();

    let map;
    let segmentSourceIds = [];
    let markers = [];
    let selectedSegment = null;
    export let segment = null;
    export let segmentSearch = false;

    const getBounds = () => {
        const bounds = map.getBounds();
        const sw = bounds.getSouthWest().toArray();
        const ne = bounds.getNorthEast().toArray();

        return [sw[1], sw[0], ne[1] , ne[0]];
    };

    const getSegments = async () => {
        const res = await fetch(`/api/segment/find.json?bounds=${getBounds()}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await res.json();
    };

    const onSegmentClick = (segment) => {
        const geoJson = polyline.toGeoJSON(segment.points);
        const coordinates = geoJson.coordinates;
        const bounds = coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        map.fitBounds(bounds, {
            padding: 20
        });
        const encodeGeoJson = encodeURIComponent(JSON.stringify(geoJson));

        const staticMap = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(${encodeGeoJson})/auto/1000x600@2x?access_token=${API_KEY}`;
        selectedSegment = {
            ...segment,
            staticMap
        };

        dispatch('segmentClick', {
            segment: selectedSegment
        });
    };

    const drawSegment = segment => {
        // const coord = polyline.toGeoJSON(segment.points.replace(/\\\\/g, '\\'));
        const geoJSON = polyline.toGeoJSON(segment.points);
        const coordinates = polyline.decode(segment.points)[0];

        const id = `segment-${segment.id}`;
        segmentSourceIds = [...segmentSourceIds, id ];
        map.addSource(id, {
            'type': 'geojson',
            'data': geoJSON,
            'tolerance': 0.00001
        });
        map.addLayer({
            'id': id,
            'type': 'line',
            'source': id,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#888',
                'line-width': 5
            }
        });

        const marker = new mapboxgl.Marker().setLngLat(coordinates.reverse());
        marker.getElement().addEventListener('click', onSegmentClick.bind(null, segment) );
        marker.addTo(map);
        markers = [...markers, marker];
    };

    const clearSegments = () => {
        segmentSourceIds.forEach(id => {
            map.off('click', id, onSegmentClick);
            map.removeLayer(id);
            map.removeSource(id);
        });

        markers.forEach(marker => {
            marker.getElement().removeEventListener('click', onSegmentClick );
            marker.remove();
        });

        markers = [];
        segmentSourceIds = [];
    };

    const addSegments = () => {
        getSegments().then(res => {
            res.segments.forEach(x => {
                drawSegment(x);
            });
        })
    };

    const eventForSegmentSearch = () => {
        map.on('moveend', function(e) {
            if(!selectedSegment) {
                clearSegments();
                setTimeout(() => { addSegments() }, 300);
            }
        });

        map.on('load', function() {
            clearSegments();
            setTimeout(() => { addSegments() }, 300);
        });
    };

    onMount(async () => {
        mapboxgl.accessToken = API_KEY;


        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [13.0038, 55.6050],
            zoom: 9
        });

        if (segmentSearch) {
            eventForSegmentSearch();
        }

        if (segment) {
            map.on('load', function() {
                console.log("segment");
                setTimeout(() => {
                    drawSegment(segment);
                    onSegmentClick(segment);
                }, 300);
            });
        }
    });


</script>

<div id="map"></div>

<style>

    #map {
        height: 400px;
        width: 100%;
        margin: 0px;
        padding: 0px
    }
</style>