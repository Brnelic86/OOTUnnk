<template>
  <br />
  <q-btn label="Unos profesora" color="primary" @click="addProfessorPrompt" />
  <div class="row justify-content-center">
    <div class="col-2 d-flex align-items-stretch" v-for="professor in professors" :key="professor.ID">
      <q-card class="my-card bg-secondary text-white">
        <q-card-section>
          <div class="text-h6">{{ professor.Ime_Prezime }} </div>
          <div class="text">Datum Rođenja: </div>
          <div class="text-subtitle2">{{ professor.Datum_rodenja }}</div>
          <div class="text">OIB: </div>
          <div class="text-subtitle2">{{ professor.OIB }}</div>
          <div class="text">Korisničko Ime: </div>
          <div class="text-subtitle2">{{ professor.Korisnicko_ime }}</div>
        </q-card-section>
        <q-separator dark />
        <q-card-actions>
          <q-btn flat @click="editProfessor(professor)">Uredi</q-btn>
          <q-btn flat @click="deleteProfessor(professor.ID)">Izbriši</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
  <!-- Ostali dijelovi predloška ostaju nepromijenjeni -->
  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Ime: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="imeUnos" autofocus @keyup.enter="prompt = false" />
        <div v-if="imeError" class="text-red">Ime je obavezno.</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Datum rođenja: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="datumRodjenjaUnos"
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
          <q-date v-model="datumRodjenjaUnos" mask="YYYY-MM-DD" />
        </q-popup-proxy>
        <div v-if="datumRodjenjaError" class="text-red">Datum rođenja je obavezan.</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">OIB: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="oibUnos" maxlength="11" autofocus @keyup.enter="prompt = false" />
        <div v-if="oibError" class="text-red">OIB je obavezan i mora imati 11 znamenki.</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Korisničko Ime: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="korisnickoImeUnos" autofocus @keyup.enter="prompt = false" />
        <div v-if="korisnickoImeError" class="text-red">Korisničko ime je obavezno.</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Lozinka: </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="lozinkaUnos" type="password" autofocus @keyup.enter="prompt = false" />
        <div v-if="lozinkaError" class="text-red">Lozinka je obavezna.</div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Save" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section> Profesor je uspješno dodan/uređen! </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Ok" color="primary" v-close-popup @click="closeAndReload" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Formatiraj datum u YYYY-MM-DD format
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + (d.getDate() + 1);
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const professors = ref([]);
const prompt = ref(false);
const showDialog = ref(false);
const imeUnos = ref('');
const datumRodjenjaUnos = ref('');
const oibUnos = ref('');
const korisnickoImeUnos = ref('');
const lozinkaUnos = ref('');
const currentProfessor = ref(null);
const showDatePicker = ref(false);

const imeError = ref(false);
const datumRodjenjaError = ref(false);
const oibError = ref(false);
const korisnickoImeError = ref(false);
const lozinkaError = ref(false);

const getProfessors = async () => {
  try {
    const response = await axios.get('http://localhost:4200/profesori/');
    professors.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const editProfessor = (professor) => {
  currentProfessor.value = professor;
  imeUnos.value = professor.Ime_Prezime;
  datumRodjenjaUnos.value = professor.Datum_rodenja || '';
  oibUnos.value = professor.OIB || '';
  korisnickoImeUnos.value = professor.Korisnicko_ime || '';
  lozinkaUnos.value = professor.Lozinka || '';
  prompt.value = true;
};

const addProfessorPrompt = () => {
  currentProfessor.value = null;
  imeUnos.value = '';
  datumRodjenjaUnos.value = '';
  oibUnos.value = '';
  korisnickoImeUnos.value = '';
  lozinkaUnos.value = '';
  prompt.value = true;
};

const handleSave = () => {
  imeError.value = !imeUnos.value.trim();
  datumRodjenjaError.value = !datumRodjenjaUnos.value.trim();
  oibError.value = !oibUnos.value.trim() || oibUnos.value.length !== 11 || isNaN(oibUnos.value);
  korisnickoImeError.value = !korisnickoImeUnos.value.trim();
  lozinkaError.value = !lozinkaUnos.value.trim();

  if (!imeError.value && !datumRodjenjaError.value && !oibError.value && !korisnickoImeError.value && !lozinkaError.value) {
    saveChanges();
  }
};

const saveChanges = async () => {
  if (currentProfessor.value) {
    const updatedData = {
      ID: currentProfessor.value.ID,
      Ime: imeUnos.value,
      DatumRodjenja: formatDate(datumRodjenjaUnos.value), // Pretvori datum u ispravan format
      OIB: oibUnos.value,
      KorisnickoIme: korisnickoImeUnos.value,
      Lozinka: lozinkaUnos.value
    };
    try {
      await axios.put(`http://localhost:4200/updateProfessor/${currentProfessor.value.ID}`, updatedData);
      showDialog.value = true;
      getProfessors();
    } catch (error) {
      console.error(error);
    }
  } else {
    addProfessor();
  }
};

const addProfessor = async () => {
  const newProfessor = {
    Ime: imeUnos.value,
    DatumRodjenja: formatDate(datumRodjenjaUnos.value), // Pretvori datum u ispravan format
    OIB: oibUnos.value,
    KorisnickoIme: korisnickoImeUnos.value,
    Lozinka: lozinkaUnos.value
  };
  try {
    await axios.post('http://localhost:4200/dodajProfesora/', newProfessor);
    showDialog.value = true;
    getProfessors();
    imeUnos.value = '';
    datumRodjenjaUnos.value = '';
    oibUnos.value = '';
    korisnickoImeUnos.value = '';
    lozinkaUnos.value = '';
  } catch (error) {
    console.error(error);
  }
};

const canDeleteProfessor = async (id) => {
  try {
    const [erasmusResponse, radoviResponse, usavrsavanjeResponse] = await Promise.all([
      axios.get(`http://localhost:4200/erasmus?profesorId=${id}`),
      axios.get(`http://localhost:4200/radovi?profesorId=${id}`),
      axios.get(`http://localhost:4200/strucnoUsavrsavanje?profesorId=${id}`)
    ]);

    const hasErasmus = erasmusResponse.data.data.some(erasmus => erasmus.ErasmusProfesor === id);
    const hasRadovi = radoviResponse.data.data.some(rad => rad.RadoviProfesor === id);
    const hasUsavrsavanje = usavrsavanjeResponse.data.data.some(usavrsavanje => usavrsavanje.UsavrsavanjeProfesor === id);

    return !hasErasmus && !hasRadovi && !hasUsavrsavanje;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const deleteProfessor = async (id) => {
  const canDelete = await canDeleteProfessor(id);
  if (!canDelete) {
    alert('Nemoguće izbrisati profesora jer je na njega vezan neki rad, erasmus ili stručno usavršavanje.');
    return;
  }
  
  try {
    await axios.delete(`http://localhost:4200/deleteProfessor/${id}`);
    getProfessors();
  } catch (error) {
    console.error(error);
  }
};

const closeAndReload = () => {
  showDialog.value = false;
  getProfessors();
};

onMounted(() => {
  getProfessors();
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
