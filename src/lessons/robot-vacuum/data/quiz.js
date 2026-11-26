/**
 * Quiz questions for the Robot Vacuum lesson.
 * Types:
 *  - mcq:   { q, options: [{ text, icon?, pic? }], answer: index, explain }
 *  - match: { q, pairs: [{ left, right }], explain }  (tap a left item, then its partner)
 *  - order: { q, items: [{ text, sub }], explain }    (items listed in the correct order)
 */
export const questions = [
  {
    type: 'mcq',
    q: 'How did Trilobite, one of the first robot vacuums, sense the room?',
    options: [
      { icon: '🦇', text: 'With sound echoes, like a bat' },
      { icon: '📷', text: 'With a camera' },
      { icon: '👃', text: 'By smelling the dust' },
    ],
    answer: 0,
    explain: 'Trilobite used ultrasound — it sent out sounds and listened for the echo, just like a bat.',
  },
  {
    type: 'mcq',
    q: 'What was the problem with the early Roomba’s “bump and turn” moving?',
    options: [
      { icon: '🪜', text: 'It couldn’t find stairs' },
      { icon: '🧭', text: 'It had no sense of direction, so it was slow' },
      { icon: '🔦', text: 'It needed an expensive laser' },
    ],
    answer: 1,
    explain: 'It turned randomly, so it cleaned some spots twice and missed others.',
  },
  {
    type: 'mcq',
    q: 'Which cleaning path belongs to a robot that has a map?',
    options: [
      { pic: 'random', text: 'Path A' },
      { pic: 'rows', text: 'Path B' },
    ],
    answer: 1,
    explain: 'With a map, a robot can plan neat rows and cover the whole floor.',
  },
  {
    type: 'match',
    q: 'Match each robot part to its job!',
    pairs: [
      { left: '🛡️ Bumper', right: 'Feels when it touches something' },
      { left: '🔦 Laser', right: 'Measures how far away the walls are' },
      { left: '📷 Camera', right: 'Spots socks, toys and pets' },
      { left: '🪜 Stair sensor', right: 'Stops it falling down the stairs' },
    ],
    explain: 'Every part helps Robo sense the world in a different way.',
  },
  {
    type: 'mcq',
    q: 'True or false: a laser bounces off things to help measure how far away they are.',
    options: [
      { icon: '👍', text: 'True' },
      { icon: '👎', text: 'False' },
    ],
    answer: 0,
    explain: 'True! The light bounces back. The quicker it returns, the closer the object is.',
  },
  {
    type: 'mcq',
    q: 'Why is a robot vacuum with a camera and AI smarter?',
    options: [
      { icon: '🧦', text: 'It can recognise things like socks and pets' },
      { icon: '🎲', text: 'It moves around randomly' },
      { icon: '🚫', text: 'It doesn’t need any sensors' },
    ],
    answer: 0,
    explain: 'AI helps it understand what the camera sees, so it can go around obstacles.',
  },
  {
    type: 'order',
    q: 'Put the robots in order, from oldest to newest!',
    items: [
      { text: '🦇 Trilobite', sub: 'sound echoes' },
      { text: '💥 Roomba', sub: 'bump & turn' },
      { text: '🔦 Neato XV-11', sub: 'laser map' },
      { text: '📷 Roomba 980', sub: 'camera + AI' },
    ],
    explain: '1996 Trilobite → 2002 Roomba → 2010 Neato XV-11 → 2015 Roomba 980.',
  },
  {
    type: 'mcq',
    q: 'What did iRobot learn from the expensive Trilobite?',
    options: [
      { icon: '⚖️', text: 'A product must be useful AND affordable' },
      { icon: '🎲', text: 'Random moving is the best way' },
      { icon: '💎', text: 'The more expensive, the better' },
    ],
    answer: 0,
    explain: 'Roomba was simple and cheap, so millions of families could buy one.',
  },
]
