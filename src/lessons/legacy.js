/**
 * Colleagues' lessons shown unchanged inside the platform frame (see platform/LegacyLesson.vue),
 * for a quick merge before a lesson is rebuilt in the platform design.
 * Entry shape: { id, slug, unit, lesson, title, subtitle, icon, color, blurb, minutes, art,
 *   legacy: { src: 'legacy/<folder>/index.html', allow?, storage? } } with the files in public/legacy/.
 * All current lessons are native, so the list is empty.
 */
export const legacyLessons = []
