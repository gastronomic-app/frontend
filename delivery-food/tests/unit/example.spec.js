import { render } from "@testing-library/vue";
import Documentation from "@/views/docs/Documentation.vue";

test('increments value on click', async () => {
  // Renderiza el componente y obtiene el método por desestructuración
  const { getByText } = render(Documentation)

  // Trata de recuperar el texto y genera error si no lo encuentra
  getByText('Welcome to Your Vue.js App')
})
