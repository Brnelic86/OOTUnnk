<template>
  <br />
  <q-btn label="Unos stručnog usavršavanja" color="primary" @click="addUsavrsavanjePrompt" />
  <div class="row justify-content-center">
    <div class="col-2 d-flex align-items-stretch" v-for="post in posts" :key="post.ID">
      <q-card class="my-card bg-secondary text-white">
        <q-card-section>
          <div class="text-h6">{{ post.Naziv }}</div>
          <div class="text">Odobritelj: </div>
          <div class="text-subtitle2">{{ post.Odobritelj }}</div>
          <div class="text">Organizator: </div>
          <div class="text-subtitle2">{{ post.Organizator }}</div>
          <div class="text">Datum početka: </div>
          <div class="text-subtitle2">{{ post.DatumPocetka }}</div>
          <div class="text">Datum završetka: </div>
          <div class="text-subtitle2">{{ post.DatumZavrsetka }}</div>
        </q-card-section>

        <q-card-section>
          {{ lorem }}
        </q-card-section>

        <q-separator dark />

        <q-card-actions>
          <q-btn flat @click="editUsavrsavanje(post)">Uredi</q-btn>
          <q-btn flat @click="deleteUsavrsavanje(post.ID)">Izbriši</q-btn>
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
        <q-input dense v-model="nazivUnos" autofocus @keyup.enter="prompt = false" />
        <div v-if="nazivError" class="text-red">Naziv je obavezan.</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Odobritelj: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="odobriteljUnos" />
        <div v-if="odobriteljError" class="text-red">Odobritelj je obavezan.</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Organizator: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="organizatorUnos" />
        <div v-if="organizatorError" class="text-red">Organizator je obavezan.</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Vrsta usavršavanja: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          ref="selectedCategory1Ref"
          filled
          type="text"
          lazy-rules
          emit-value
          v-model="selectedCategory1"
          label="Vrsta usavrsavanja"
          :options="postsVrstaUsavrsavanja"
          option-label="Naziv_Usavrsavanja"
          option-value="ID"
          use-input
          use-chips
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Profesor: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          ref="selectedCategory2Ref"
          filled
          type="text"
          lazy-rules
          emit-value
          v-model="selectedCategory2"
          label="Profesor"
          :options="postsProfesori"
          option-label="Ime_Prezime"
          option-value="ID"
          use-input
          use-chips
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
          @keyup.enter="prompt = false"
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
          @keyup.enter="prompt = false"
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
        <q-btn flat label="Save" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section> Stručno usavršavanje je uspješno dodano! </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Ok" color="primary" v-close-popup @click="closeAndReload" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { format } from "date-fns";

const posts = ref([]);
const postsVrstaUsavrsavanja = ref([]);
const postsProfesori = ref([]);
const prompt = ref(false);
const showDialog = ref(false);
const nazivUnos = ref('');
const odobriteljUnos = ref('');
const organizatorUnos = ref('');
const datumPocetakUnos = ref('');
const datumZavrsetakUnos = ref('');
const selectedCategory1 = ref(null);
const selectedCategory2 = ref(null);
const showDatePicker = ref(false);
const showDatePickerZavrestak = ref(false);
const nazivError = ref(false);
const odobriteljError = ref(false);
const organizatorError = ref(false);
const datumPocetakError = ref(false);
const datumZavrsetakError = ref(false);
const currentUsavrsavanje = ref(null);

const getPosts = async () => {
  try {
    const response = await axios.get("http://localhost:4200/strucnoUsavrsavanje/");
    posts.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
  try {
    const response = await axios.get("http://localhost:4200/vrstaUsavrsavanja/");
    postsVrstaUsavrsavanja.value = response.data.data;
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

const editUsavrsavanje = (usavrsavanje) => {
  currentUsavrsavanje.value = usavrsavanje;
  nazivUnos.value = usavrsavanje.Naziv;
  odobriteljUnos.value = usavrsavanje.Odobritelj;
  organizatorUnos.value = usavrsavanje.Organizator;
  datumPocetakUnos.value = usavrsavanje.DatumPocetka;
  selectedCategory1.value = usavrsavanje.UsavrsavanjeVrstaUsavrsavanja;
  selectedCategory2.value = usavrsavanje.UsavrsavanjeProfesor;
  datumZavrsetakUnos.value = usavrsavanje.DatumZavrsetka;
  prompt.value = true;
};

const addUsavrsavanjePrompt = () => {
  currentUsavrsavanje.value = null;
  nazivUnos.value = '';
  odobriteljUnos.value = '';
  organizatorUnos.value = '';
  datumPocetakUnos.value = '';
  selectedCategory1.value = null;
  selectedCategory2.value = null;
  datumZavrsetakUnos.value = '';
  prompt.value = true;
};

const handleSave = () => {
  nazivError.value = !nazivUnos.value.trim();
  odobriteljError.value = !odobriteljUnos.value.trim();
  organizatorError.value = !organizatorUnos.value.trim();
  datumPocetakError.value = !datumPocetakUnos.value.trim();
  datumZavrsetakError.value = !datumZavrsetakUnos.value.trim();

  if (
    nazivError.value ||
    odobriteljError.value ||
    organizatorError.value ||
    datumPocetakError.value ||
    datumZavrsetakError.value
  ) {
    return;
  }

  if (currentUsavrsavanje.value) {
    updateUsavrsavanje();
  } else {
    addUsavrsavanje();
  }
};

const updateUsavrsavanje = async () => {
  const updatedData = {
    ID: currentUsavrsavanje.value.ID,
    Naziv: nazivUnos.value,
    Odobritelj: odobriteljUnos.value,
    Organizator: organizatorUnos.value,
    vrstaUsavrsavanja: selectedCategory1.value,
    profesor: selectedCategory2.value,
    DatumPocetka: format(new Date(datumPocetakUnos.value), "yyyy-MM-dd"),
    DatumZavrsetka: format(new Date(datumZavrsetakUnos.value), "yyyy-MM-dd"),
  };
  try {
    const response = await axios.put(
      `http://localhost:4200/updateUsavrsavanje/${currentUsavrsavanje.value.ID}`,
      updatedData
    );
    console.log(response.data);
    getPosts();
    prompt.value = false;
  } catch (error) {
    console.error(error);
  }
};

const addUsavrsavanje = async () => {
  const newUsavrsavanje = {
    Naziv: nazivUnos.value,
    Odobritelj: odobriteljUnos.value,
    Organizator: organizatorUnos.value,
    vrstaUsavrsavanja: selectedCategory1.value,
    profesor: selectedCategory2.value,
    DatumPocetka: format(new Date(datumPocetakUnos.value), "yyyy-MM-dd"),
    DatumZavrsetka: format(new Date(datumZavrsetakUnos.value), "yyyy-MM-dd"),
  };
  try {
    const response = await axios.post(
      "http://localhost:4200/dodajUsavrsavanje/",
      newUsavrsavanje
    );
    console.log(response.data);
    getPosts();
    prompt.value = false;
    nazivUnos.value = '';
    odobriteljUnos.value = '';
    organizatorUnos.value = '';
    datumPocetakUnos.value = '';
    datumZavrsetakUnos.value = '';
    selectedCategory1.value = null;
    selectedCategory2.value = null;
  } catch (error) {
    console.error(error);
  }
};

const deleteUsavrsavanje = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:4200/deleteUsavrsavanje/${id}`
    );
    console.log(response.data);
    getPosts();
  } catch (error) {
    console.error(error);
  }
};

const closeAndReload = () => {
  showDialog.value = false;
  getPosts();
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
