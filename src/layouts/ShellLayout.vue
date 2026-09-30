<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import TopBar from '../components/TopBar.vue'
</script>

<template>
  <div class="min-h-screen bg-background md:flex">
    <Sidebar />
    <div class="min-w-0 flex-1">
      <TopBar />
      <main class="mx-auto max-w-7xl p-5 md:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>
