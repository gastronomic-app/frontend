<template>
  <div>
   <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top static-top nav-background">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img class="logo" src="@/assets/logo.png" alt="">
      </a>
        
      <button 
        class="navbar-toggler" 
        type="button" 
        data-toggle="collapse" 
        data-target="#navbarResponsive" 
        aria-controls="navbarResponsive" 
        aria-expanded="false" 
        aria-label="Toggle navigation">
          <span class="navbar-toggler-icon">
             
          </span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active ">
            <a href="" class="nav-link">
              <router-link to="/">Establecimientos</router-link>
            </a>
            
          </li>
          <li class="nav-item active">
            <a href="" class="nav-link">
              <router-link to="/example-list">CRUD</router-link>
            </a>
            
          </li>
          
          <li class="nav-item active">
            <a class="nav-link" href="#">Inicio
                <span class="sr-only">(current)</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Nosotros</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Servicios</a>
          </li>
          <li class="nav-item active ">
            <a href="" class="nav-link"> </a>
            <i class="vertical-line justify-content-center"></i>
          </li>
        
          <li class="nav-item">
            <a class="nav-link font-orange" href="#">Iniciar Sesiòn</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Registrarse</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container">
      <router-view />
  </div>
  </div>
</template>

<script>
/**
 * Barra de navegación común
 */
export default {
  name: "NavBar",
};
</script>

<style scoped>


.nav-background{
  background-color: black !important;  
}
.logo{
  width: 30%;
  height: 80%;
}
.font-orange{
  color:orangered !important;
}
.font-orange:hover{
  text-decoration: none;
}
.vertical-line{

  bottom: 20px;
  margin-left: .5em;
  padding-bottom: 10px;
  position:absolute;
  z-index:10;
  width: 2px;
  height: 2em;
  border-left:thick-solid;
  background: grey;

}

</style>
