<template>
  <section class="hero">
    <div class="hero-inner">
      <h1 class="hero-title">
        El comercio se mueve rápido.
        <br />
        <span class="accent">Nuestra plataforma se mueve más rápido</span>
      </h1>

      <p class="hero-sub">
        Escala todo tu negocio con la plataforma de pedidos: rendimiento, conversiones y agilidad.
      </p>

      <div class="hero-cta">
        <button class="btn-primary">Contáctanos</button>
        <button class="btn-ghost">Comenzar</button>
      </div>
    </div>

    <div class="hero-cards">
      <!-- tarjetas visuales tipo mockups -->
      <div class="card visual" v-for="(img, i) in images" :key="i">
        <img :src="img" :alt="'visual ' + i" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Hero',
  data() {
    return {
      images: [
        'https://images.unsplash.com/photo-1523301343968-1b2a8f1d6d6b?auto=format&w=800&q=50',
        'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&w=800&q=50',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&w=800&q=50',
        'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&w=800&q=50',
        'https://images.unsplash.com/photo-1504252060326-9f29a5f45b2e?auto=format&w=800&q=50'
      ]
    }
  }
}
</script>