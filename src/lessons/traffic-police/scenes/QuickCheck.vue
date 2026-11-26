<script setup>
import ClassQuestion from '../components/ClassQuestion.vue'
import BlinkySay from '../components/BlinkySay.vue'
import TeacherTip from '../../../shared/TeacherTip.vue'
import { QUICK_CHECK, NOTES } from '../data/content'
</script>

<template>
  <section class="ai-scene">
    <span class="ai-tag tp-k--orange">🚩 Quick check</span>
    <BlinkySay text="Quick check! Do you remember what the camera saves?" />
    <div class="ai-card"><ClassQuestion :q="QUICK_CHECK" /></div>
    <TeacherTip :text="NOTES.check" />
  </section>
</template>
