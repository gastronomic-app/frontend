<template>
  <section>
    <div class="alien-div">
      <img class="alien" src="@/assets/alien.png" width="30%" alt="" />
    </div>
    <a class="back" href="#"> </a>
  </section>
</template>

//Error: there aren´t  orders
<style scoped>
.alien-div {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.alien {
  margin-top: 1em;
    animation-name: fly;
    animation-delay: 4s;
  animation-duration: 3s;
  animation-fill-mode: forwards;
}
.back {
  display: flex;
  justify-content: center;
  height: 2em;
  width: 2em;
  border-radius: 100%;
  top: 8em;
  left: 1.5em;
  text-align: center;
  margin: auto;

  color: black;
  background-color: grey;
  animation-name: abduction;
  animation-duration: 3s;
  
  animation-fill-mode: forwards;

}
@keyframes fly {
    from{
        margin-top: 1em;
    }
    to{
        transform:translate(-30em, -100%)
    }
}

@keyframes abduction {
  from {
    border-radius: 100%;
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.466);
  }
  to {
    box-shadow: 0 -20px 50px 30px rgba(0, 0, 0, 0);
    background-color: rgba(0, 0, 0, 0.3);
    padding-top: 2em;
    border-radius: 100%;
    transform: translate(0, -5.5em);
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>
