<template>
  <br />
  <q-btn label="Unos nove kategorizacije" color="primary" @click="prompt = true" />
  <div class="row justify-content-center">
    <div class="col-2 d-flex align-items-stretch" v-for="post in posts" :key="post.ID">
      <q-card class="my-card bg-secondary text-white">
        <q-card-section>
          <div class="text-h6">{{ post.Naziv }}</div>
          <div class="text-subtitle2">{{ post.Naziv }}</div>
        </q-card-section>
        <q-card-section>
          {{ lorem }}
        </q-card-section>
        <q-separator dark />
        <q-card-actions>
          <q-btn flat @click="editPost(post)">Uredi</q-btn>
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
        <q-input dense v-model="nazivMobilnostiUnos" autofocus @keyup.enter="prompt = false" />
        <div v-if="nazivError" class="text-red">Naziv je obavezan.</div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Add address" @click="handleAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="editPrompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Uredi naziv: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="editNazivMobilnosti" autofocus @keyup.enter="editPrompt = false" />
        <div v-if="editNazivError" class="text-red">Naziv je obavezan.</div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Save" @click="handleUpdate" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section> Vrsta mobilnosti je uspješno dodana! </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Ok" color="primary" v-close-popup @click="closeAndReload" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const posts = ref([]);
const prompt = ref(false);
const editPrompt = ref(false);
const showDialog = ref(false);
const nazivMobilnostiUnos = ref('');
const editNazivMobilnosti = ref('');
const selectedPostId = ref(null);
const nazivError = ref(false);
const editNazivError = ref(false);

async function getPosts() {
  try {
    const response = await axios.get('http://localhost:4200/mobilnosti/');
    posts.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

const unesiVrstuMobilnosti = async () => {
  const sampleData = {
    naziv: nazivMobilnostiUnos.value
  };
  try {
    const response = await axios.post('http://localhost:4200/dodajVrstuMobilnosti/', sampleData);
    nazivMobilnostiUnos.value = '';
    showDialog.value = true;
    getPosts();
  } catch (error) {
    console.error(error);
  }
};

const editPost = (post) => {
  selectedPostId.value = post.ID;
  editNazivMobilnosti.value = post.Naziv;
  editPrompt.value = true;
};

const updatePost = async () => {
  const sampleData = {
    naziv: editNazivMobilnosti.value
  };
  try {
    const response = await axios.put(`http://localhost:4200/updateVrstuMobilnosti/${selectedPostId.value}`, sampleData);
    getPosts();
  } catch (error) {
    console.error(error);
  }
};

const deletePost = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:4200/deleteVrstuMobilnosti/${id}`);
    getPosts();
  } catch (error) {
    console.error(error);
  }
};

const closeAndReload = () => {
  showDialog.value = false;
  getPosts();
};

const handleAdd = () => {
  if (!nazivMobilnostiUnos.value.trim()) {
    nazivError.value = true;
  } else {
    nazivError.value = false;
    prompt.value = false;
    unesiVrstuMobilnosti();
  }
};

const handleUpdate = () => {
  if (!editNazivMobilnosti.value.trim()) {
    editNazivError.value = true;
  } else {
    editNazivError.value = false;
    editPrompt.value = false;
    updatePost();
  }
};

onMounted(() => {
  getPosts();
});
</script>

<style scoped>
.my-card {
  margin: 20px;
  width: 100%;
  max-width: 300px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.col-2 {
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.text-red {
  color: red;
}
</style>
