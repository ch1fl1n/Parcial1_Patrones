<template>
  <div class="app">
    <header class="nav">
      <div class="logo">🛍️ <span class="brand">Pedidos</span></div>
      <nav class="nav-links">
        <a href="#">Plataforma</a>
        <a href="#">Precios</a>
        <button class="btn-outline">Contáctanos</button>
      </nav>
    </header>

    <Hero />

    <main class="container">
      <section class="intro">
        <h3>Panel de ejemplo</h3>
        <p>
          Este frontend es un esqueleto Vue3 para conectar con tu backend (Spring Boot).
          Usa la sección de tarjetas para mostrar productos, pedidos o estadísticas.
        </p>
      </section>

      <CardGrid />
    </main>

    <footer class="footer">
      <small>Proyecto de patrones arquitectónicos — Frontend (Vue)</small>
    </footer>
  </div>
</template>

<script>
import Hero from './components/Hero.vue'
import CardGrid from './components/CardGrid.vue'

export default {
  name: 'App',
  components: { Hero, CardGrid }
}
</script>