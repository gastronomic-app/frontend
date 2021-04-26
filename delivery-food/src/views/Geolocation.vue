<template>
    <div>
        <div>
            <h3>Ubicación actual del pedido</h3>
        </div>
        <br>
        <GmapMap
            :center='center'
            :zoom='17'
            style='width:100%; height: 400px;'>
            <GmapMarker
            :key="index"
            v-for="(m,index) in markers"
            :position="m.position"
            @click="center=m.position"
            /> 
        </GmapMap>
            
    </div>
</template>
<script>
export default {
    name: 'GoogleMap',
    data(){
       return{
        center: {lat: 2.4573845,lng: -76.6349537},
        currentPlace:{lat: 2.119853, lng:-76.978499},
        markers:[],
        places:[],
       } 
    },
    mounted() {
        this.getPosition();
        this.addMarker();
    },
    methods: {
        setPlace(place){
            this.currentPlace=place;

        },
        addMarker(){
            if(this.currentPlace){
                const marker={
                    lat: this.currentPlace.lat,
                    lng:this.currentPlace.lng,
                };
                this.markers.push({position:marker});
                this.places.push(this.currentPlace);
                this.center=marker;
                this.currentPlace=null;
            }
        },
        getPosition(){
            if (navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                    position =>{
                        this.center={
                            lat: position.coords.latitude,
                            lng:position.coords.longitude,
                        };
                 
                    },
                    error => {
                        console.log(error.message);
                    }
               
                 );
            }
            
         
        }
    },
}
</script>
<style>

</style>