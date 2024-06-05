<template>
  <br/>
  <q-btn label="Unos novog Erasmusa" color="primary" @click="openAddDialog" />
  <div class="row justify-content-center">
    <div class="col-2 d-flex align-items-stretch" v-for="post in posts" :key="post.ID">
      <q-card class="my-card bg-secondary text-white">
        <q-card-section>
          <div class="text-h6">{{ post.Naziv_Institucije }}</div>
          <div class="text">Datum početka: </div>
          <div class="text-subtitle2">{{ post.DatumPocetka }}</div>
          <div class="text">Datum Zavrsetka: </div>
          <div class="text-subtitle2">{{ post.DatumZavrsetka }}</div>
        </q-card-section>

        <q-card-section>
          {{ lorem }}
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
        <div class="text-h6">Naziv institucije: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="nazivUnos" autofocus />
        <div v-if="nazivError" class="text-red">Naziv erasmusa je obavezan.</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Profesor: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          ref="selectedCategory1Ref"
          filled
          type="text"
          lazy-rules
          emit-value
          v-model="selectedCategory1"
          label="Profesor"
          :options="postsProfesori"
          option-label="Ime_Prezime"
          option-value="ID"
          use-input
          use-chips
          :rules="[(val) => (val !== null && val !== '') || 'Odaberite profesora']"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Mobilnost: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          ref="selectedCategory2Ref"
          filled
          type="text"
          lazy-rules
          emit-value
          v-model="selectedCategory2"
          label="Vrsta mobilnosti"
          :options="postsMobilnosti"
          option-label="Naziv_Mobilnosti"
          option-value="ID"
          use-input
          use-chips
          :rules="[(val) => (val !== null && val !== '') || 'Odaberite vrstu mobilnosti']"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Datum početka: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="datumPocetakUnos"
          mask="####-##-##"
          placeholder="YYYY-MM-DD"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" @click="showDatePicker = true" />
          </template>
        </q-input>
        <q-popup-proxy
          v-model="showDatePicker"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date v-model="datumPocetakUnos" mask="YYYY-MM-DD" />
        </q-popup-proxy>
        <div v-if="datumPocetakError" class="text-red">Datum početka je obavezan.</div>
      </q-card-section>
      
      <q-card-section>
        <div class="text-h6">Datum završetka: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="datumZavrsetakUnos"
          mask="####-##-##"
          placeholder="YYYY-MM-DD"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" @click="showDatePickerZavrestak = true" />
          </template>
        </q-input>
        <q-popup-proxy
          v-model="showDatePickerZavrestak"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date v-model="datumZavrsetakUnos" mask="YYYY-MM-DD" />
        </q-popup-proxy>
        <div v-if="datumZavrsetakError" class="text-red">Datum završetka je obavezan.</div>
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
import { format } from "date-fns";

const posts = ref([]);
const postsProfesori = ref([]);
const postsMobilnosti = ref([]);
const prompt = ref(false);
const showDatePicker = ref(false);
const showDatePickerZavrestak = ref(false);
const nazivUnos = ref('');
const selectedCategory1 = ref(null);
const selectedCategory2 = ref(null);
const datumPocetakUnos = ref('');
const datumZavrsetakUnos = ref('');
const editMode = ref(false);
const currentPostId = ref(null);

const nazivError = ref(false);
const datumPocetakError = ref(false);
const datumZavrsetakError = ref(false);

const getPosts = async () => {
  try {
    const response = await axios.get("http://localhost:4200/erasmus/");
    posts.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
  try {
    const response = await axios.get("http://localhost:4200/profesori/");
    postsProfesori.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
  try {
    const response = await axios.get("http://localhost:4200/vrstaMobilnosti/");
    postsMobilnosti.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const validateForm = () => {
  nazivError.value = !nazivUnos.value?.trim();
  datumPocetakError.value = !datumPocetakUnos.value?.trim();
  datumZavrsetakError.value = !datumZavrsetakUnos.value?.trim();

  if (!nazivError.value && !datumPocetakError.value && !datumZavrsetakError.value) {
    if (editMode.value) {
      updatePost();
    } else {
      unesiVrstuMobilnosti();
    }
  }
};

const unesiVrstuMobilnosti = async () => {
  const sampleData = {
    naziv: nazivUnos.value,
    datumPocetka: format(new Date(datumPocetakUnos.value), 'yyyy-MM-dd'),
    datumZavrsetka: format(new Date(datumZavrsetakUnos.value), 'yyyy-MM-dd'),
    profesor: selectedCategory1.value,
    mobilnost: selectedCategory2.value
  };
  try {
    await axios.post('http://localhost:4200/dodajErasmus/', sampleData);
    resetForm();
    getPosts();
  } catch (error) {
    console.error(error);
  }
};

const openEditDialog = (post) => {
  nazivUnos.value = post.Naziv_Institucije;
  datumPocetakUnos.value = post.DatumPocetka;
  datumZavrsetakUnos.value = post.DatumZavrsetka;
  selectedCategory1.value = post.ErasmusProfesor;
  selectedCategory2.value = post.ErasmusMobilnost;
  currentPostId.value = post.ID;
  editMode.value = true;
  prompt.value = true;
};

const updatePost = async () => {
  const updatedData = {
    Naziv_Institucije: nazivUnos.value,
    DatumPocetka: format(new Date(datumPocetakUnos.value), 'yyyy-MM-dd'),
    DatumZavrsetka: format(new Date(datumZavrsetakUnos.value), 'yyyy-MM-dd'),
    profesor: selectedCategory1.value,
    mobilnost: selectedCategory2.value
  };
  try {
    await axios.put(`http://localhost:4200/updateErasmus/${currentPostId.value}`, updatedData);
    resetForm();
    getPosts();
  } catch (error) {
    console.error(error);
  }
};

const deletePost = async (postId) => {
  try {
    await axios.delete(`http://localhost:4200/deleteErasmus/${postId}`);
    getPosts();
  } catch (error) {
    console.error(error);
  }
};

const resetForm = () => {
  nazivUnos.value = '';
  datumPocetakUnos.value = '';
  datumZavrsetakUnos.value = '';
  selectedCategory1.value = null;
  selectedCategory2.value = null;
  nazivError.value = false;
  datumPocetakError.value = false;
  datumZavrsetakError.value = false;
  editMode.value = false;
  currentPostId.value = null;
};

const openAddDialog = () => {
  resetForm();
  prompt.value = true;
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

.col-2 {
  display: flex;
  justify-content: center;
}

.text-red {
  color: red;
}
</style>
