import React from "react";
import { motion } from "framer-motion";
import "./AboutPage.css";
import Header from "./component/Header";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

  
export default function AboutPage() {
  const navigate = useNavigate();
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <div className="about-page">
<Helmet>
      <title>About Clinigoal | Clinical Education Platform</title>
      <meta
        name="description"
        content="Clinigoal empowers clinical education with expert-led courses, case studies, and interactive learning for aspiring healthcare professionals."
      />
      <meta name="keywords" content="clinical education, healthcare training, medical courses, clinical research" />
      <meta property="og:title" content="About Clinigoal" />
      <meta property="og:description" content="Clinigoal empowers clinical education with expert-led courses, case studies, and interactive learning." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:image" content="https://yourwebsite.com/preview-image.png" />
    </Helmet>


        <Header />
      {/* Hero Section */}
      <motion.section
        className="about-hero"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1>About Clinigoal</h1>
        <p>
          Clinigoal is dedicated to empowering modern clinical education with expert-led courses, real-world case studies, and interactive learning experiences.
        </p>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section
        className="mission-vision"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div className="card" variants={fadeInUp}>
          <h2>Our Mission</h2>
          <p>
            To provide accessible, high-quality clinical education that bridges theory with practical skills, preparing learners for successful careers.
          </p>
        </motion.div>
        <motion.div className="card" variants={fadeInUp}>
          <h2>Our Vision</h2>
          <p>
            To be the leading online platform for clinical education and training, shaping the next generation of healthcare and research professionals.
          </p>
        </motion.div>
      </motion.section>

      {/* Core Values */}
      <motion.section
        className="values"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <h2>Our Core Values</h2>
        <motion.div className="value-grid">
          {[
            { title: "Excellence", desc: "We strive for the highest quality in teaching and learning." },
            { title: "Integrity", desc: "We maintain honesty and transparency in all interactions." },
            { title: "Innovation", desc: "We embrace new technologies and learning methods." },
            { title: "Community", desc: "We foster collaboration and support among learners and instructors." },
          ].map((value, idx) => (
            <motion.div
              key={idx}
              className="value-card"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            >
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Workflow Section */}
      <motion.section
        className="workflow"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <h2>How Clinigoal Works</h2>
        <motion.ol>
          {[
            { step: "Register", desc: "Create a student account to access courses and resources." },
            { step: "Learn", desc: "Attend lectures, complete interactive case studies, and engage in assessments." },
            { step: "Apply", desc: "Gain hands-on skills to excel in clinical research, coding, and pharmacovigilance." },
            { step: "Grow", desc: "Track progress and earn certifications for career advancement." },
          ].map((item, idx) => (
            <motion.li key={idx} variants={fadeInUp}>
              <strong>{item.step}:</strong> {item.desc}
            </motion.li>
          ))}
        </motion.ol>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="about-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2>Join Thousands of Learners Today</h2>
        <p>Upskill with expert-led courses and real-world case studies. Your clinical career starts here!</p>
        <motion.button
  className="btn btn-primary"
  onClick={() => navigate("/courses")}
  whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(37,99,235,0.5)" }}
  whileTap={{ scale: 0.95 }}
>
  Explore Courses
</motion.button>
      </motion.section>
    </div>
  );
}
