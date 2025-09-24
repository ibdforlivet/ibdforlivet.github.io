<template>
  <div class="about">
    <div class="container">
      <header class="about-header">
        <h1>{{ pageTitle }}</h1>
        <p class="lead">{{ subtitle }}</p>
      </header>

      <section class="about-content">
        <div class="content-grid">
          <div class="text-content">
            <h2>Our Story</h2>
            <p>{{ story }}</p>
            
            <h2>Our Mission</h2>
            <p>{{ mission }}</p>

            <h2>What We Offer</h2>
            <ul class="features-list">
              <li v-for="feature in features" :key="feature.id">
                <strong>{{ feature.title }}:</strong> {{ feature.description }}
              </li>
            </ul>
          </div>

          <div class="stats-sidebar">
            <h3>By the Numbers</h3>
            <div class="stat-item" v-for="stat in stats" :key="stat.label">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="team-section">
        <h2>Meet the Team</h2>
        <div class="team-grid">
          <div class="team-member" v-for="member in team" :key="member.id">
            <div class="member-avatar">{{ member.initials }}</div>
            <h3>{{ member.name }}</h3>
            <p class="member-role">{{ member.role }}</p>
            <p class="member-bio">{{ member.bio }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      pageTitle: 'About Us',
      subtitle: 'Passionate about bringing delicious recipes to your kitchen',
      story: 'Founded in 2024, our platform was born from a simple idea: everyone deserves access to amazing recipes and the joy of cooking. We started as a small team of food enthusiasts who wanted to create a space where culinary creativity could flourish.',
      mission: 'Our mission is to inspire and empower home cooks of all skill levels by providing high-quality recipes, detailed instructions, and a supportive community. We believe that cooking is more than just preparing food—it\'s about bringing people together, creating memories, and expressing creativity.',
      features: [
        {
          id: 1,
          title: 'Recipe Collection',
          description: 'Thousands of tested and approved recipes from various cuisines'
        },
        {
          id: 2,
          title: 'Step-by-Step Guides',
          description: 'Detailed instructions with photos and cooking tips'
        },
        {
          id: 3,
          title: 'Community Support',
          description: 'Connect with other cooks, share experiences, and get advice'
        },
        {
          id: 4,
          title: 'Dietary Options',
          description: 'Recipes for all dietary preferences and restrictions'
        }
      ],
      stats: [
        { value: '10,000+', label: 'Recipes' },
        { value: '50,000+', label: 'Happy Cooks' },
        { value: '25+', label: 'Countries' },
        { value: '4.8/5', label: 'User Rating' }
      ],
      team: [
        {
          id: 1,
          name: 'Sarah Johnson',
          role: 'Head Chef & Founder',
          bio: 'Former restaurant chef with 15 years of experience',
          initials: 'SJ'
        },
        {
          id: 2,
          name: 'Mike Chen',
          role: 'Recipe Developer',
          bio: 'Specializes in Asian cuisine and fusion cooking',
          initials: 'MC'
        },
        {
          id: 3,
          name: 'Emma Williams',
          role: 'Nutrition Expert',
          bio: 'Registered dietitian focusing on healthy cooking',
          initials: 'EW'
        }
      ]
    }
  },
  mounted() {
    console.log('About page mounted')
  }
}
</script>

<style scoped>
.about {
  min-height: 100vh;
  padding: 80px 0;
  background-color: var(--neutral-cream);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-header {
  text-align: center;
  margin-bottom: 80px;
}

.about-header h1 {
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 4rem);
  color: var(--primary-green-dark);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.lead {
  font-size: 1.4rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
  font-weight: 400;
}

.about-content {
  margin-bottom: 80px;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: start;
}

.text-content h2 {
  font-family: var(--font-display);
  color: var(--primary-green-dark);
  margin-bottom: 1.5rem;
  margin-top: 3rem;
  font-size: 2.2rem;
  font-weight: 600;
}

.text-content h2:first-child {
  margin-top: 0;
}

.text-content p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.features-list {
  list-style: none;
  padding: 0;
}

.features-list li {
  color: #666;
  line-height: 1.7;
  margin-bottom: 1rem;
  padding-left: 1rem;
  position: relative;
}

.features-list li::before {
  content: '✓';
  color: var(--primary-green);
  font-weight: bold;
  position: absolute;
  left: 0;
}

.stats-sidebar {
  background: var(--neutral-warm-white);
  padding: 3rem 2rem;
  border-radius: 24px;
  height: fit-content;
  border: 1px solid var(--neutral-medium-gray);
  box-shadow: 0 6px 24px rgba(44, 42, 38, 0.08);
}

.stats-sidebar h3 {
  font-family: var(--font-display);
  color: var(--primary-green-dark);
  margin-bottom: 2.5rem;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
}

.stat-item {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--neutral-light-gray);
}

.stat-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.stat-number {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-green);
  line-height: 1;
}

.stat-label {
  color: var(--text-light);
  font-size: 1rem;
  margin-top: 0.75rem;
  font-weight: 500;
}

.team-section {
  text-align: center;
}

.team-section h2 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  color: var(--primary-green-dark);
  margin-bottom: 4rem;
  font-weight: 600;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;
}

.team-member {
  background: var(--neutral-warm-white);
  padding: 3rem 2rem;
  border-radius: 24px;
  border: 1px solid var(--neutral-medium-gray);
  box-shadow: 0 6px 24px rgba(44, 42, 38, 0.08);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.team-member::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green) 0%, var(--accent-sage) 100%);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.team-member:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(122, 139, 87, 0.15);
}

.team-member:hover::before {
  transform: scaleX(1);
}

.member-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--accent-sage) 100%);
  color: var(--neutral-warm-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
  border: 3px solid var(--neutral-warm-white);
  box-shadow: 0 4px 16px rgba(122, 139, 87, 0.25);
}

.team-member h3 {
  font-family: var(--font-display);
  color: var(--primary-green-dark);
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.member-role {
  color: var(--primary-green);
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.member-bio {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .about-header h1 {
    font-size: 2.5rem;
  }
  
  .lead {
    font-size: 1.1rem;
  }
}
</style>