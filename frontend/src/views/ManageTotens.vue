<template>
  <div class="manage-container">
    <div class="header">
      <router-link to="/admin" class="back-button">&larr; Back</router-link>
      <h1>Manage Totens</h1>
    </div>

    <div class="content-grid">
      <div class="form-card">
        <h3>Register New Totem</h3>
        <form @submit.prevent="createTotem">
          <div class="form-group">
            <label for="name">Nome do Totem</label>
            <input id="name" v-model="form.name" type="text" placeholder="Ex: Totem do RU" required />
          </div>
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>

      <div class="list-card">
        <h3>Registered Totems</h3>
        <div v-if="isLoading && totems.length === 0" class="empty-list">
          Loading totems...
        </div>
        <div v-else-if="totems.length === 0" class="empty-list">
          No totems registered.
        </div>
        <ul v-else class="totem-list">
          <li v-for="totem in totems" :key="totem._id" class="totem-item">
            <div class="totem-info">
              <strong>{{ totem.name }}</strong>
              <span v-if="totem.authToken" class="token-display">
                <input :id="'token-' + totem._id" type="text" :value="totem.authToken" readonly />
                <button @click="copyToken('token-' + totem._id)">Copy</button>
              </span>
              <span class="totem-meta">Registered on: {{ new Date(totem.createdAt).toLocaleDateString('pt-BR') }}</span>
              <span class="totem-meta">Last seen: {{ totem.lastSeen ? new Date(totem.lastSeen).toLocaleString('pt-BR') : 'Never' }}</span>
            </div>
            <div class="totem-actions">
              <button class="btn-delete" @click="deleteTotem(totem._id)">Delete</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totems: [],
      form: {
        name: '',
      },
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async fetchTotems() {
      this.isLoading = true;
      try {
        const response = await fetch('/api/totem');
        if (!response.ok) throw new Error('Fail to load totems.');
        this.totems = await response.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async createTotem() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch('/api/totem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form),
        });
        if (!response.ok) throw new Error('Fail to register totem.');
        

        const newTotem = await response.json();
        this.totems.push(newTotem);
        
        this.form.name = ''; 
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteTotem(id) {
      if (!window.confirm('Are you sure you want to delete this totem? This will disconnect it.')) {
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/totem/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Fail to delete totem.');

        this.totems = this.totems.filter(t => t._id !== id);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    copyToken(inputId) {
      const input = document.getElementById(inputId);
      input.select();
      
      try {
        document.execCommand('copy');
        alert('Token copied to clipboard!');
      } catch (err) {
        alert('Failed to copy the token. Please copy it manually.');
      }
    }
  },
  mounted() {
    this.fetchTotems();
  },
};
</script>

<style scoped>
/* mesmissima coisa do ManageSlides */
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
  grid-template-columns: 1fr 2fr; 
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

/* Estilos do Formulário */
.form-group { margin-bottom: 1.5rem; }
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #c0c0c0;
}
.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #1e1e1e;
  border: 1px solid #444;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
}
.form-group input:focus {
  outline: none;
  border-color: #f5a623;
  box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.3);
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: #f5a623;
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%; 
}
button:disabled { 
  background-color: #3a3a3a;
  cursor: not-allowed;
}
button:not(:disabled):hover { background-color: #f7b94e; }

.empty-list {
  color: #9e9e9e;
  text-align: center;
  padding: 2rem;
}

.totem-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.totem-item {
  background-color: #1e1e1e;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.totem-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
}
.totem-info strong {
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
}

.token-display {
  display: flex;
  gap: 0.5rem;
}
.token-display input {
  flex-grow: 1;
  background-color: #111;
  color: #f5a623;
  border: 1px solid #444;
  padding: 0.5rem;
  font-family: monospace;
  font-size: 0.9rem;
  border-radius: 4px;
}
.token-display button {
  width: auto; 
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: #4a90e2;
  color: #fff;
}
.token-display button:hover { background-color: #5aa1f2; }

.totem-meta {
  color: #9e9e9e;
  font-size: 0.85rem;
}

.totem-actions {
  flex-shrink: 0;
}

.btn-delete {
  width: auto;
  background-color: #c94a4a;
  color: #fff;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}
.btn-delete:hover { background-color: #e57373; }

.error-message {
  color: #e57373;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
</style>