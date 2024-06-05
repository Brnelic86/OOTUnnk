<template>
  <br/>
  <q-btn label="Dodaj novi rad" color="primary" @click="openAddDialog" />
  <div class="row justify-content-center">
    <div class="col-2 d-flex align-items-stretch" v-for="post in posts" :key="post.ID">
      <q-card class="my-card bg-secondary text-white">
        <q-card-section>
          <div class="text-h6">{{ post.Naziv }}</div>
          <div class="text">Opis: </div>
          <div class="text-subtitle2">{{ post.Opis }}</div>
          <div class="text">Godina: </div>
          <div class="text-subtitle2">{{ post.Godina }}</div>
          <div class="text">Studenti: </div>
          <div class="text-subtitle2">{{ post.Studenti }}</div>
          <div class="text">Kategorizacija: </div>
          <div class="text-subtitle2">{{ getKategorijaNaziv(post.RadoviKategorizacijaRada) }}</div>
          <div class="text">Profesor: </div>
          <div class="text-subtitle2">{{ getProfesorNaziv(post.RadoviProfesor) }}</div>
        </q-card-section>
        <q-separator dark />
        <q-card-actions>
          <q-btn flat @click="openEditDialog(post)">Uredi</q-btn>
          <q-btn flat @click="deletePost(post.ID)">Izbriši</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>

  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Naziv: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="nazivUnos" autofocus @keyup.enter="validateForm" />
        <div v-if="nazivError" class="text-red">Naziv je obavezan.</div>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Opis: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="opisUnos" autofocus @keyup.enter="validateForm" />
        <div v-if="opisError" class="text-red">Opis je obavezan.</div>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Godina: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model.number="godinaUnos" type="number" @keyup.enter="validateForm" />
        <div v-if="godinaError" class="text-red">Godina je obavezna.</div>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Studenti: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="studentiUnos" autofocus @keyup.enter="validateForm" />
        <div v-if="studentiError" class="text-red">Studenti su obavezni.</div>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Kategorizacija rada: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          ref="selectedCategory1Ref"
          filled
          type="text"
          lazy-rules
          emit-value
          v-model="selectedCategory1"
          label="Kategorizacija rada"
          :options="postsKategorizacija"
          option-label="Naziv"
          option-value="ID"
          use-input
          use-chips
          :rules="[(val) => (val !== null && val !== '') || 'Odaberite kategoriju']"
        />
        <div v-if="kategorizacijaError" class="text-red">Kategorizacija je obavezna.</div>
      </q-card-section>
      
      <q-card-section>
        <div class="text-h6">Vrsta recenzije: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          ref="selectedCategory2Ref"
          filled
          type="text"
          lazy-rules
          emit-value
          v-model="selectedCategory2"
          label="Vrsta recenzije"
          :options="postsVrstaRecenzije"
          option-label="Naziv"
          option-value="ID"
          use-input
          use-chips
          :rules="[(val) => (val !== null && val !== '') || 'Odaberite vrstu recenzije']"
        />
        <div v-if="vrstaRecenzijeError" class="text-red">Vrsta recenzije je obavezna.</div>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Profesor: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          ref="selectedCategory3Ref"
          filled
          type="text"
          lazy-rules
          emit-value
          v-model="selectedCategory3"
          label="Profesor"
          :options="postsProfesori"
          option-label="Ime_Prezime"
          option-value="ID"
          use-input
          use-chips
          :rules="[(val) => (val !== null && val !== '') || 'Odaberite profesora']"
        />
        <div v-if="profesorError" class="text-red">Profesor je obavezan.</div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Save" @click="validateForm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const posts = ref([]);
const postsKategorizacija = ref([]);
const postsVrstaRecenzije = ref([]);
const postsProfesori = ref([]);
const prompt = ref(false);
const nazivUnos = ref('');
const opisUnos = ref('');
const godinaUnos = ref(0);
const studentiUnos = ref('');
const selectedCategory1 = ref(null);
const selectedCategory2 = ref(null);
const selectedCategory3 = ref(null);
const editMode = ref(false);
const currentPostId = ref(null);

const nazivError = ref(false);
const opisError = ref(false);
const godinaError = ref(false);
const studentiError = ref(false);
const kategorizacijaError = ref(false);
const vrstaRecenzijeError = ref(false);
const profesorError = ref(false);

const getPosts = async () => {
  try {
    const response = await axios.get("http://localhost:4200/radovi/");
    posts.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
  try {
    const response = await axios.get("http://localhost:4200/mobilnosti/");
    postsKategorizacija.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
  try {
    const response = await axios.get("http://localhost:4200/vrstaRecenzije/");
    postsVrstaRecenzije.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
  try {
    const response = await axios.get("http://localhost:4200/profesori/");
    postsProfesori.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const getKategorijaNaziv = (sifra_kategorije) => {
  const kategorija = postsKategorizacija.value.find(cat => cat.ID === sifra_kategorije);
  return kategorija ? kategorija.Naziv : 'Nepoznato';
};

const getProfesorNaziv = (profesor) => {
  const kategorija = postsProfesori.value.find(cat => cat.ID === profesor);
  return kategorija ? kategorija.Ime_Prezime : 'Nepoznato';
};

const openAddDialog = () => {
  resetForm();
  editMode.value = false;
  prompt.value = true;
};

const openEditDialog = (post) => {
  nazivUnos.value = post.Naziv;
  opisUnos.value = post.Opis;
  godinaUnos.value = post.Godina;
  studentiUnos.value = post.Studenti;
  selectedCategory1.value = post.RadoviKategorizacijaRada;
  selectedCategory2.value = post.RadoviVrstaRecenzije;
  selectedCategory3.value = post.RadoviProfesor;
  currentPostId.value = post.ID;
  editMode.value = true;
  prompt.value = true;
};

const validateForm = () => {
  nazivError.value = !nazivUnos.value?.trim();
  opisError.value = !opisUnos.value?.trim();
  godinaError.value = !godinaUnos.value || isNaN(godinaUnos.value);
  studentiError.value = !studentiUnos.value?.trim();
  kategorizacijaError.value = !selectedCategory1.value;
  vrstaRecenzijeError.value = !selectedCategory2.value;
  profesorError.value = !selectedCategory3.value;

  if (!nazivError.value && !opisError.value && !godinaError.value && !studentiError.value && !kategorizacijaError.value && !vrstaRecenzijeError.value && !profesorError.value) {
    savePost();
  }
};

const savePost = async () => {
  const newPost = {
    naziv: nazivUnos.value,
    opis: opisUnos.value,
    godina: godinaUnos.value,
    sifra_kategorije: selectedCategory1.value,
    studenti: studentiUnos.value,
    vrstaRecenzije: selectedCategory2.value,
    profesor: selectedCategory3.value
  };

  if (editMode.value) {
    await axios.put(`http://localhost:4200/radovi/${currentPostId.value}`, newPost);
  } else {
    await axios.post("http://localhost:4200/dodajRad", newPost);
  }
  getPosts();
  prompt.value = false;
};

const deletePost = async (id) => {
  try {
    await axios.delete(`http://localhost:4200/deleteRad/${id}`);
    getPosts();
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

const resetForm = () => {
  nazivUnos.value = '';
  opisUnos.value = '';
  godinaUnos.value = 0;
  studentiUnos.value = '';
  selectedCategory1.value = null;
  selectedCategory2.value = null;
  selectedCategory3.value = null;
  nazivError.value = false;
  opisError.value = false;
  godinaError.value = false;
  studentiError.value = false;
  kategorizacijaError.value = false;
  vrstaRecenzijeError.value = false;
  profesorError.value = false;
};

onMounted(() => {
  getPosts();
});
</script>

<style scoped>
.my-card {
  width: 300px;
  margin: 10px;
}
</style>
