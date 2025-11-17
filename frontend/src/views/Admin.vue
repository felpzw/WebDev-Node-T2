<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1>Painel Administrativo</h1>
      <button class="logout-button" @click="handleLogout">Sair</button>
    </div>

    <div class="admin-content">
      <p>Welcome</p>
      <p>Now you can manage Slides and Totens</p>
      
      <div class="action-cards">
        <router-link to="/totem" class="card totem-card">
          <h3>See Toten</h3>
          <p>Viwer Public Screen</p>
        </router-link>
        
        <router-link to="/admin/slides" class="card slide-card">
          <h3>Manage Slides</h3>
          <p>Create Edit and Remove Slides</p>
        </router-link>

         <router-link to="/admin/totems" class="card totem-card-manage">
          <h3>Manage Totens</h3>
          <p>Register new devices.</p>
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../router';

export default {
  methods: {
    handleLogout() {
      auth.isLoggedIn = false;
      localStorage.setItem('isLoggedIn', 'false');
      
      fetch('/api/auth/logoff').finally(() => {

        this.$router.push('/login');
      });
    },
  },
};
</script>

<style scoped>
.admin-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  flex-grow: 1;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #3a3a3a;
  padding-bottom: 1rem;
}

.admin-header h1 {
  color: #fff;
  font-weight: 700;
}

.logout-button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  background-color: #c94a4a;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #e57373;
}

.admin-content p {
  font-size: 1.1rem;
  color: #c0c0c0;
  margin-bottom: 0.5rem;
}

.action-cards {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: #2a2a2a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #3a3a3a;
  text-decoration: none;
  color: #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card h3 {
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.card p {
  font-size: 0.95rem;
  color: #9e9e9e;
  line-height: 1.5;
}

.totem-card-view { border-color: #4a90e2; }
.totem-card-view:hover { box-shadow: 0 8px 20px rgba(74, 144, 226, 0.15); }

.slide-card { border-color: #50e3c2; }
.slide-card:hover { box-shadow: 0 8px 20px rgba(80, 227, 194, 0.15); }

.totem-card-manage { border-color: #f5a623; }
.totem-card-manage:hover { box-shadow: 0 8px 20px rgba(245, 166, 35, 0.15); }
</style>