<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Admmin Panel</h2>
      <p class="subtitle">Make Login to manage Totems and Slides</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="ex: admin"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { auth } from '../router';

export default {
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (response.ok) {
          auth.isLoggedIn = true;
          localStorage.setItem('isLoggedIn', 'true');
          
          this.$router.push('/admin');
        } else {
          const data = await response.json();
          this.error = data.message || 'Invalid Credentials.';
        }
      } catch (err) {
        this.error = 'Cant connect to server. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  padding: 2rem;
}

.login-card {
  background-color: #2a2a2a;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  border: 1px solid #3a3a3a;
}

h2 {
  text-align: center;
  color: #fff;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #9e9e9e;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

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
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
}

button {
  width: 100%;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: #4a90e2;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

button:disabled {
  background-color: #3a3a3a;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #5aa1f2;
}

button:not(:disabled):active {
  transform: scale(0.98);
}

.error-message {
  color: #e57373;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
</style>