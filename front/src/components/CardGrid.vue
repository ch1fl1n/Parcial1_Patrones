<template>
  <section class="cards">
    <div class="cards-grid">
      <article class="card-info" v-for="n in 6" :key="n">
        <div class="card-header">
          <div class="dot"></div>
          <h4>Pedido #00{{ 100 + n }}</h4>
        </div>
        <p class="muted">Estado: <strong>{{ n % 3 === 0 ? 'Enviado' : n % 2 === 0 ? 'Procesando' : 'Pendiente' }}</strong></p>
        <div class="price">USD {{ (Math.random() * 500 + 20).toFixed(2) }}</div>
        <button class="btn-small">Ver</button>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CardGrid'
}
</script>