<template>
  <div class="manage-container">
    <div class="header">
      <router-link to="/admin" class="back-button">&larr; Back</router-link>
      <h1>Manage Slides</h1>
    </div>

    <div class="content-grid">
      <div class="form-card">
        <h3>{{ isEditing ? 'Edit Slide' : 'New Slide' }}</h3>
        <form @submit.prevent="handleSaveSlide">
          <div class="form-group">
            <label for="title">Title</label>
            <input id="title" v-model="form.title" type="text" placeholder="Ex: Lunch Menu" required />
          </div>
          <div class="form-group">
            <label for="duration">Duration (seconds)</label>
            <input id="duration" v-model.number="form.duration" type="number" min="1" required />
          </div>
          <div class="form-group">
            <label for="expirationDate">Expiration Date</label>
            <input id="expirationDate" v-model="form.expirationDate" type="datetime-local" required />
          </div>
          <div class="form-group">
            <label for="content">HTML Content</label>
            <textarea id="content" v-model="form.content" rows="10" placeholder="Ex: <h1>Rice and Beans...</h1>" required></textarea>
          </div>
          <div class="button-group">
            <button type="submit" :disabled="isLoading">{{ isEditing ? 'Save' : 'Create' }}</button>
            <button type="button" class="btn-cancel" v-if="isEditing" @click="resetForm">Cancel</button>
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>

      <div class="list-card">
        <h3>Current Slides</h3>
        <div v-if="isLoading && slides.length === 0" class="empty-list">
          Loading slides...
        </div>
        <div v-else-if="slides.length === 0" class="empty-list">
          No slides registered.
        </div>
        <ul v-else class="slide-list">
          <li v-for="slide in slides" :key="slide._id" class="slide-item">
            <div class="slide-info">
              <strong>{{ slide.title }}</strong> ({{ slide.duration }}s)
              <span>Expires: {{ new Date(slide.expirationDate).toLocaleString() }}</span>
            </div>
            <div class="slide-actions">
              <button class="btn-edit" @click="editSlide(slide)">Edit</button>
              <button class="btn-delete" @click="deleteSlide(slide._id)">Delete</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// converte a data na data de amanha (estava causando bug)
function toLocalIsoString(date) {
  const d = new Date(date);
  // subtrai a data do timezone (offset)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

// retorna a data 24 horas dps
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

export default {
  data() {
    return {
      slides: [],
      form: {
        title: '',
        duration: 30,
        content: '',
        // FIX: Default is now Tomorrow. No more expired slides on creation.
        expirationDate: toLocalIsoString(getTomorrowDate()), 
      },
      isEditing: false,
      currentSlideId: null,
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async fetchSlides() {
      this.isLoading = true;
      try {
        const response = await fetch('/api/slide');
        if (!response.ok) throw new Error('Fail to load slides.');
        this.slides = await response.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async handleSaveSlide() {
      if (this.isEditing) {
        await this.updateSlide();
      } else {
        await this.createSlide();
      }
    },
    async createSlide() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch('/api/slide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form),
        });
        if (!response.ok) throw new Error('Fail to create slide.');
        await this.fetchSlides();
        this.resetForm(); 
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async updateSlide() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/slide/${this.currentSlideId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form),
        });
        if (!response.ok) throw new Error('Fail to update slide.');
        await this.fetchSlides();
        this.resetForm();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteSlide(id) {
      if (!window.confirm('Are you sure you want to delete this slide?')) {
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/slide/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Fail to delete slide.');
        await this.fetchSlides();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    editSlide(slide) {
      this.isEditing = true;
      this.currentSlideId = slide._id;
      this.form.title = slide.title;
      this.form.duration = slide.duration;
      this.form.content = slide.content;
      // Convert the stored UTC date back to Local Input format
      this.form.expirationDate = toLocalIsoString(slide.expirationDate);
      window.scrollTo(0, 0);
    },
    resetForm() {
      this.isEditing = false;
      this.currentSlideId = null;
      this.form.title = '';
      this.form.duration = 30;
      this.form.content = '';
      // FIX: Reset to Tomorrow
      this.form.expirationDate = toLocalIsoString(getTomorrowDate());
      this.error = null;
    },
  },
  mounted() {
    this.fetchSlides();
  },
};
</script>

<style scoped>
.manage-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #3a3a3a;
  padding-bottom: 1rem;
}

.header h1 { color: #fff; margin-left: 1rem; }

.back-button {
  color: #4a90e2;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
}
.back-button:hover { text-decoration: underline; }

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: flex-start;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.form-card, .list-card {
  background-color: #2a2a2a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #3a3a3a;
}

h3 {
  color: #fff;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #444;
  padding-bottom: 0.75rem;
}

.form-group { margin-bottom: 1.5rem; }
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #c0c0c0;
}
.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #1e1e1e;
  border: 1px solid #444;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
}
.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #50e3c2;
  box-shadow: 0 0 0 3px rgba(80, 227, 194, 0.3);
}
.form-group textarea { resize: vertical; }

.button-group { display: flex; gap: 1rem; }

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: #50e3c2;
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}
button:disabled { 
  background-color: #3a3a3a;
  cursor: not-allowed;
}
button:not(:disabled):hover { background-color: #6cfadd; }

.btn-cancel {
  background-color: #777;
  color: #fff;
}
.btn-cancel:hover { background-color: #999; }

.empty-list {
  color: #9e9e9e;
  text-align: center;
  padding: 2rem;
}

.slide-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.slide-item {
  background-color: #1e1e1e;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.slide-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1;
}
.slide-info strong {
  color: #fff;
  font-weight: 600;
}
.slide-info span {
  color: #9e9e9e;
  font-size: 0.85rem;
}

.slide-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}
.slide-actions button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.btn-edit {
  background-color: #4a90e2;
  color: #fff;
}
.btn-edit:hover { background-color: #5aa1f2; }

.btn-delete {
  background-color: #c94a4a;
  color: #fff;
}
.btn-delete:hover { background-color: #e57373; }

.error-message {
  color: #e57373;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
</style>