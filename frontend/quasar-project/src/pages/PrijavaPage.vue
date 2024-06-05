<template>
  <div class="login-form">
    <h2 class="form-title">Prijava</h2>
    <input type="text" v-model="korisnickoImeUnos" placeholder="Korisničko ime" class="input-field">
    <input type="password" v-model="lozinkaUnos" placeholder="Lozinka" class="input-field">
    <button @click="handleClick" class="submit-btn">Prijava</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const posts = ref([]);
const korisnickoImeUnos = ref('');
const lozinkaUnos = ref('');
const router = useRouter();

async function getPosts() {
  try {
    const response = await axios.get('http://localhost:4200/profesori/');
    posts.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

const provjeriKorisnika = () => {
  return posts.value.some(post => post.Korisnicko_ime === korisnickoImeUnos.value && post.Lozinka === lozinkaUnos.value);
};

const handleClick = () => {
  const korisnikPostoji = provjeriKorisnika();
  if (korisnikPostoji) {
    router.push('/vrsteMobilnosti');
    localStorage.setItem("token", response.data.token);
  } else {
    alert('Korisnik ne postoji!');
  }
};

onMounted(() => {
  getPosts();
});
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #ffffff;
}

.input-field {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>
