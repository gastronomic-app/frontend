<template>
  <div>
    <div class="accordion" id="accordionExample">
      <div class="card">
        <div
          class="card-header"
          :id="'heading' + id"
          v-bind:class="{
            'card-color': !item.selected,
            selected: item.selected,
          }"
        >
          <h2 class="mb-0 flex">
            <button
              class="btn btn-block text-left btn-width shadow-none"
              
              type="button"
              data-toggle="collapse"
              :data-target="'#collapse' + id"
              :aria-controls="'collapse' + id"
            >
              Pedido realizado # {{ id + 1 }}
            </button>
            <span v-if="checkbox_use" class="force-left">
              <label class="container-checkbox">
                <input
                  type="checkbox"
                  :checked="item.selected"
                  @click="item.selected = !item.selected"
                />
                <span class="checkmark"></span>
              </label>
            </span>
          </h2>
        </div>

        <div
          :id="'collapse' + id"
          class="collapse"
          :aria-labelledby="'heading' + id"
          data-parent="#accordionExample"
          
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Accordion",
  props: ["item", "id", "checkbox_use"],
};
</script>

<style>
:root{
  --hover-selected: rgba(0, 0, 0, 0.9);
  --terce-color: orangered;
}
/* Customize the label (the container) */
.container-checkbox {
  display: block;
  position: relative;
  margin-top: 0.6em;
  cursor: pointer;
  font-size: 18px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 15px;
  width: 15px;
  background-color: rgb(182, 182, 182);
}

/* On mouse-over, add a grey background color */
.container-checkbox:hover input ~ .checkmark {
  background-color: rgb(173, 172, 172);
}

/* When the checkbox is checked, add a blue background */
.container-checkbox input:checked ~ .checkmark {
  background-color: var(--terce-color);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container-checkbox input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container-checkbox .checkmark:after {
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

</style>

<style scoped>
.card-header:hover {
  background-color:var(--hover-selected);
  color: black;
}
.selected {
  background-color: var(--hover-selected);
}
.force-left {
  width: 3%;
  position: relative;
}
.flex {
  display: flex;
  width: 100%;
}
.btn-width {
  width: 97%;
  color: whitesmoke;
}
.card-color {
  background-color: var(--dark);
}
</style>