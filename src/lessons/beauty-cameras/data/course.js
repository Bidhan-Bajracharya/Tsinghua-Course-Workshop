// All course content lives here, so teachers can edit text without touching components.
// English only (the original lesson also had Chinese).
// Each stage becomes a part of the lesson in ../BeautyCamerasLesson.vue; each activity `type` maps to a mini-game
// (see ../components/activities/index.js). An activity's optional `badge` is earned
// when a child finishes it.

// Face "looks" for CartoonFace. A look only lists what differs from CartoonFace's defaults.
// Note: the everyday beauty filter keeps the person's skin tone. Skin lightening only appears
// in the "Is this filter fair?" activity, where children learn to notice it.
const PLAIN_FACE = { skin: '#d9a47c', blemishes: true }
const FILTERED_FACE = {
  skin: '#d9a47c',
  blush: '#f08a9a',
  lips: '#e0607a',
  filter: 'brightness(1.08) saturate(1.15)',
}
const GLASSES_FACE = { skin: '#c68e63', glasses: true }

export const course = {
  module: 'AI Around Us',
  unit: 'Unit 2 · Lesson 3',
  title: 'Beauty Cameras',
  subtitle: 'From editing to AI filters—use them wisely.',

  // Badges reward thinking, not speed.
  badges: [
    {
      id: 'predictor',
      icon: '🔮',
      name: 'Predictor',
      earnedFor: 'Guessed, then checked',
    },
    {
      id: 'detective',
      icon: '🕵️',
      name: 'Detective',
      earnedFor: 'Spotted changed photos',
    },
    {
      id: 'thinker',
      icon: '💬',
      name: 'Thinker',
      earnedFor: 'Shared their own ideas',
    },
    {
      id: 'fair',
      icon: '🤝',
      name: 'Fair & Kind',
      earnedFor: 'Respects others and all kinds of beauty',
    },
  ],

  stages: [
    {
      id: 'welcome',
      type: 'welcome',
      icon: '🚀',
      name: 'Start',
      mascot: "Hi! I'm Snappy the camera 📷. Today it's not about being fast—it's about thinking!",
      missionsTitle: "Today's 3 missions",
      missions: [
        {
          icon: '🔍',
          text: 'Find out how beauty cameras grew with AI technology.',
        },
        {
          icon: '⚙️',
          text: 'Learn how a beauty camera works.',
        },
        {
          icon: '💖',
          text: 'Learn to use beauty filters in a healthy way.',
        },
      ],
      howTitle: 'How we learn',
      howSteps: [
        { icon: '🔮', text: 'Guess first' },
        { icon: '🧪', text: 'Then try it' },
        { icon: '💬', text: 'Share what you think' },
      ],
      badgesIntro: 'Collect thinking badges:',
    },

    {
      id: 'story',
      type: 'story',
      icon: '📸',
      name: 'Story',
      badge: 'predictor',
      mascot: 'Don’t flip the switch yet! Guess what the beauty filter will change.',
      title: 'Story Start',
      text: 'Mei is video-chatting with Grandma. She wants to turn on a beauty filter…',
      predictQuestion: 'What do you think the filter will change? (pick any)',
      changes: [
        { id: 'smooth', text: 'Smoother skin', changed: true },
        { id: 'bright', text: 'Brighter picture', changed: true },
        { id: 'rosy', text: 'Rosier colours', changed: true },
        { id: 'eyes', text: 'Bigger eyes', changed: false },
        { id: 'hair', text: 'Different hair colour', changed: false },
      ],
      switchLabel: 'Beauty filter',
      cameraFilter: 'blur(0.8px) brightness(1.1) saturate(1.25) contrast(0.92)',
      plainLook: PLAIN_FACE,
      filteredLook: FILTERED_FACE,
      reveal: 'How many did you guess right? Beauty filters make photos and videos look nicer. Behind them are powerful AI algorithms.',
      // What this simple (non-AI) filter can and can't do. The lists come from `changes` above.
      filterFacts: {
        title: 'What can this filter do?',
        canLabel: '✅ It can',
        cannotLabel: '❌ It can’t',
        why: 'This is a simple filter with no AI: it only makes the whole picture softer, brighter and rosier. It doesn’t know where your eyes or hair are. Many beauty apps can already make eyes bigger or change hair colour, because they first use AI to find your face parts and hair, then change only those parts. In Level 2 you will see how AI finds face parts.',
      },
    },

    {
      id: 'editing',
      type: 'topic',
      icon: '🖼️',
      name: 'Photo Editing',
      title: 'Level 1: Photo Editing—Basic Beauty',
      mascot: 'Hop into the time machine! See how people edited photos long ago, then be a detective.',
      learn: {
        cards: [
          {
            icon: '🕯️',
            title: 'Darkroom',
            text: 'Early editing used darkroom lighting, color, and contrast.',
          },
          {
            icon: '💻',
            title: 'Software',
            text: 'Digital software like Photoshop made editing easier.',
          },
          {
            icon: '✨',
            title: 'Basic beauty',
            text: 'Basic beauty filters smooth skin and adjust tone.',
          },
        ],
        reading: [
          'Photographers once adjusted lighting, color, and contrast in darkrooms, which required skill and time.',
          'With digital photos, software like Photoshop let people adjust skin tone and remove blemishes.',
        ],
      },
      activities: [
        {
          type: 'timeMachine',
          title: 'Photo Editing Time Machine',
          baseLook: PLAIN_FACE,
          filteredLook: FILTERED_FACE,
          eras: [
            {
              id: 'darkroom',
              icon: '🕯️',
              label: 'Darkroom',
              task: 'Drag the slider to adjust the light by hand, like a photographer.',
              result: 'Adjusting light and contrast by hand is slow and takes skill.',
            },
            {
              id: 'software',
              icon: '💻',
              label: 'Software',
              task: 'Tap the little spots on the face to remove them!',
              result: 'Software removes blemishes and adjusts skin tone—much faster!',
            },
            {
              id: 'filter',
              icon: '📱',
              label: 'Beauty filter',
              task: 'Press the magic button for one-tap beauty!',
              result: 'One tap—the app finds the face and beautifies it automatically.',
            },
          ],
        },
        {
          type: 'realOrFiltered',
          badge: 'detective',
          title: 'Detective: Real or filtered?',
          instruction: 'Many photos online have been changed. Can you spot them?',
          rounds: [
            {
              question: 'Which photo used a beauty filter?',
              left: { kind: 'face', look: PLAIN_FACE },
              right: { kind: 'face', look: FILTERED_FACE },
              changedSide: 'right',
              clues: [
                { text: 'The spots are gone', correct: true },
                { text: 'Rosier cheeks', correct: true },
                { text: 'Longer hair', correct: false },
              ],
            },
            {
              question: 'Which one did AI reshape (face and eyes)?',
              left: { kind: 'face', look: { skin: '#8d5524', hair: '#1b1b1b', faceWidth: 0.86, eyeSize: 1.3 } },
              right: { kind: 'face', look: { skin: '#8d5524', hair: '#1b1b1b' } },
              changedSide: 'left',
              clues: [
                { text: 'Eyes look unnaturally big', correct: true },
                { text: 'Face got narrower', correct: true },
                { text: 'Different clothes', correct: false },
              ],
            },
            {
              question: 'Which moon photo was enhanced by AI?',
              left: { kind: 'moon', detail: 0.15 },
              right: { kind: 'moon', detail: 1, aiGuess: true },
              changedSide: 'right',
              clues: [
                { text: 'Too sharp for a phone photo', correct: true },
                { text: 'Every crater looks perfect', correct: true },
                { text: 'The moon became square', correct: false },
              ],
            },
          ],
          doneText: 'Great detective work! When you see a photo, ask: has it been changed?',
        },
      ],
      think: {
        question: 'Is an edited photo still a “real” photo?',
        options: [
          {
            id: 'yes',
            emoji: '👍',
            text: 'Yes, it’s still the same person',
            reply: 'Good point! Some people think too many changes make it no longer real. How much change is too much?',
          },
          {
            id: 'no',
            emoji: '👎',
            text: 'No, it’s been changed',
            reply: 'Good point! Others think a little light adjustment still keeps it real. Is fixing the light the same as changing a face?',
          },
          {
            id: 'depends',
            emoji: '🤔',
            text: 'It depends how much',
            reply: 'Careful thinking! Fixing the light and reshaping a face are very different.',
          },
        ],
        partnerPrompt: 'Talk with a partner: would you tell people your photo used a filter?',
      },
      quiz: {
        question: 'What did digital software like Photoshop enable?',
        options: [
          { id: 'a', text: 'Adjusting skin tone and removing blemishes.' },
          { id: 'b', text: 'Only taking photos, not editing them.' },
          { id: 'c', text: 'Building cameras from scratch.' },
        ],
        answer: 'a',
        explanation: 'Just like you tapped the spots away, software made it easy to adjust skin tone and remove blemishes.',
      },
    },

    {
      id: 'makeup',
      type: 'topic',
      icon: '💄',
      name: 'AI Filters',
      title: 'Level 2: AI Beauty Filters',
      mascot: 'Look into the AI mirror! See how AI finds your face parts—and when it gets it wrong.',
      learn: {
        cards: [
          {
            icon: '🔎',
            title: 'Analyze',
            text: 'AI analyzes a reference photo and extracts makeup features.',
          },
          {
            icon: '🧩',
            title: 'Separate',
            text: 'It separates facial structure from makeup regions.',
          },
          {
            icon: '🎨',
            title: 'Transfer',
            text: 'Features are transferred to the original photo.',
          },
        ],
        reading: [
          'AI beauty filters understand what is in a picture. They compare the original photo with a reference photo, pick out lipstick and eye shadow, and transfer them.',
          'Some filters even reshape the face, change features, and remove glasses.',
        ],
      },
      activities: [
        {
          type: 'aiMirror',
          badge: 'predictor',
          title: 'AI Mirror',
          instruction: 'With the camera, AI finds your face parts right here on this computer. Nothing is saved.',
          seesText: 'The green dots are what AI found: 478 points on your face! Move and smile—do the dots follow you?',
          makeupText: 'AI first finds your lips, eyelids and cheeks, so it knows where makeup goes. Pick a style:',
          challenges: [
            { id: 'mouth', emoji: '✋', text: 'Cover your mouth with your hand' },
            { id: 'side', emoji: '↩️', text: 'Turn your head to the side' },
            { id: 'eyes', emoji: '🙈', text: 'Cover your eyes with both hands' },
            { id: 'away', emoji: '🚶', text: 'Slowly move further away' },
          ],
          challengeDone: 'AI “guesses” based on what it has learned. When your face is covered or turned, it can get it wrong or lose you—AI makes mistakes too!',
          cartoon: {
            instruction: '① Pick a reference style  ② Press “AI makeup”',
            baseLook: GLASSES_FACE,
            goLabel: '🤖 AI makeup!',
            scanningText: 'AI is finding the face parts…',
            landmarks: [
              { x: 78, y: 112, label: 'eye' },
              { x: 122, y: 112, label: 'eye' },
              { x: 100, y: 165, label: 'lips' },
              { x: 62, y: 142, label: 'cheek' },
              { x: 138, y: 142, label: 'cheek' },
            ],
            styles: [
              {
                id: 'natural',
                emoji: '🌸',
                label: 'Natural',
                reference: { skin: '#f2c6a4', hair: '#8a5a3b', lips: '#e08a8a', eyeShadow: '#d9a6a0' },
                look: { ...GLASSES_FACE, lips: '#e08a8a', eyeShadow: '#d9a6a0' },
                // Colours for the live camera mirror: soft tints, blended into real skin.
                live: { lips: '#e0707f', eyeShadow: '#c9988a', blush: '#f4a6b0', strength: 0.6 },
                result: 'AI adds soft lipstick and eye shadow.',
              },
              {
                id: 'glam',
                emoji: '💎',
                label: 'Glam',
                reference: { skin: '#8d5524', hair: '#2e2a4a', lips: '#d94b6a', eyeShadow: '#b07cc6', blush: '#f08a9a' },
                look: { ...GLASSES_FACE, lips: '#d94b6a', eyeShadow: '#b07cc6', blush: '#f08a9a' },
                live: { lips: '#d4506e', eyeShadow: '#a98bd1', blush: '#f2909f', strength: 0.8 },
                result: 'Deeper lips and eye shadow, plus blush.',
              },
              {
                id: 'bold',
                emoji: '🔥',
                label: 'Bold',
                reference: { skin: '#e0ac69', hair: '#1c1c1c', lips: '#b3122e', eyeShadow: '#5a3fa0', blush: '#e66a80' },
                look: {
                  skin: GLASSES_FACE.skin,
                  lips: '#b3122e',
                  eyeShadow: '#5a3fa0',
                  blush: '#e66a80',
                  faceWidth: 0.88,
                  eyeSize: 1.25,
                },
                live: { lips: '#c2304f', eyeShadow: '#8a6cc4', blush: '#ee8299', strength: 1 },
                result: 'Whoa! The face got slimmer, the eyes bigger—even the glasses disappeared!',
              },
            ],
          },
        },
        {
          type: 'sortGame',
          title: 'Mini game: Face or makeup?',
          instruction: 'AI has to tell these apart. Can you?',
          choices: [
            { id: 'face', emoji: '🙂', label: 'Face part' },
            { id: 'makeup', emoji: '💄', label: 'Makeup' },
          ],
          items: [
            { id: 'eyes', emoji: '👀', text: 'Eyes', answer: 'face' },
            { id: 'lipstick', emoji: '💋', text: 'Lipstick', answer: 'makeup' },
            { id: 'nose', emoji: '👃', text: 'Nose', answer: 'face' },
            { id: 'eyeshadow', emoji: '🎨', text: 'Eye shadow', answer: 'makeup' },
            { id: 'blush', emoji: '🌸', text: 'Blush', answer: 'makeup' },
            { id: 'mouth', emoji: '👄', text: 'Mouth', answer: 'face' },
          ],
          doneText: 'Great! AI also separates face parts from makeup first, so it puts makeup in the right places.',
        },
      ],
      think: {
        question: 'AI can change how your face looks. How do you feel about that?',
        options: [
          {
            id: 'fun',
            emoji: '😄',
            text: 'It’s fun',
            reply: 'It really is fun! Some people also find it a bit strange, because the photo no longer shows how they really look.',
          },
          {
            id: 'strange',
            emoji: '😕',
            text: 'It’s a bit strange',
            reply: 'Many people agree. Others enjoy it now and then. When do you think it’s OK to play with it?',
          },
          {
            id: 'both',
            emoji: '🤔',
            text: 'Both!',
            reply: 'Great thinking! Something can be fun and strange at the same time.',
          },
        ],
        partnerPrompt: 'Talk with a partner: how did it feel when AI got your face wrong?',
      },
      quiz: {
        question: 'What must AI understand to apply makeup correctly?',
        options: [
          { id: 'a', text: 'Only the background colors.' },
          { id: 'b', text: 'Which parts are facial structure and which are makeup.' },
          { id: 'c', text: 'How to change the camera lens.' },
        ],
        answer: 'b',
        explanation: 'Just like the mini game: AI must tell face parts from makeup to put lipstick and eye shadow in the right spots.',
      },
    },

    {
      id: 'moon',
      type: 'topic',
      icon: '🌕',
      name: 'The Moon',
      title: 'Level 3: Beautifying the Moon',
      mascot: 'Teach the AI about the moon. Watch out: teaching uses electricity ⚡, and the details AI adds may not be real!',
      learn: {
        cards: [
          {
            icon: '📚',
            title: 'Learn',
            text: 'AI learns moon details from many images.',
          },
          {
            icon: '🧩',
            title: 'Fill in',
            text: 'It fills in missing detail in blurry photos.',
          },
          {
            icon: '⚡',
            title: 'Energy',
            text: 'Training and using AI both use electricity. Using it only when needed is greener.',
          },
        ],
        reading: [
          'AI learns what the moon looks like from many images, so it can add detail to a blurry photo and make it look clearer and brighter.',
          'But the added details come from photos AI learned from, so the result may not match what the camera really captured.',
        ],
      },
      activities: [
        {
          type: 'moonTrainer',
          title: 'Train the AI on the Moon',
          photosNeeded: 5,
          teachLabel: '📷 Show AI a moon photo',
          studied: 'AI has studied: {n} / {total} photos',
          energyLabel: 'Electricity used for training:',
          teachFirst: 'Teach the AI first—then the slider can go further!',
          sliderLabel: 'AI enhancement',
          captions: {
            before: 'Phone photo',
            after: 'AI enhanced',
            real: 'Real telescope photo',
          },
          levels: [
            { max: 33, label: 'Blurry 😵‍💫' },
            { max: 66, label: 'Getting clearer 🙂' },
            { max: 100, label: 'Sharp! You can see the craters 🤩' },
          ],
          isItReal: 'Is this AI moon real?',
          compareLabel: '🔭 Compare with a real telescope photo',
          compareText: 'Look at the red circle! AI added a crater that the real moon doesn’t have. AI guesses from what it learned—it looks real, but it isn’t always right.',
        },
        {
          type: 'sortGame',
          title: 'Do we need AI?',
          instruction: 'Every AI edit uses electricity ⚡. Do we really need AI each time?',
          choices: [
            { id: 'use', emoji: '⚡', label: 'Worth using AI' },
            { id: 'skip', emoji: '🌱', label: 'Skip AI' },
          ],
          items: [
            {
              id: 'science',
              emoji: '🔭',
              text: 'Make a blurry moon photo clearer for my science poster.',
              answer: 'use',
              tip: 'It has a real purpose—worth it.',
            },
            {
              id: 'hundred',
              emoji: '📚',
              text: 'Add a filter to all 100 photos on my phone.',
              answer: 'skip',
              tip: '100 AI edits use lots of electricity—pick only the ones you need.',
            },
            {
              id: 'grandma',
              emoji: '👵',
              text: 'Fix Grandma’s blurry old photo as a gift for her.',
              answer: 'use',
              tip: 'A meaningful use—worth it.',
            },
            {
              id: 'fine',
              emoji: '🙂',
              text: 'My photo already looks good, but I want one more filter.',
              answer: 'skip',
              tip: 'It’s already great—save the energy!',
            },
          ],
          doneText: 'Remember: use AI only when it’s needed—it saves energy 🌱',
        },
      ],
      think: {
        question: 'Now that you know AI can invent details, do you still trust AI-enhanced photos?',
        options: [
          {
            id: 'trust',
            emoji: '👍',
            text: 'Yes, it looks so clear',
            reply: 'It is clear! But clear doesn’t always mean true. For a science project, how could you check?',
          },
          {
            id: 'careful',
            emoji: '🧐',
            text: 'I’ll be careful and check',
            reply: 'Great habit! Some people think it’s fine just to enjoy it if it’s only for fun.',
          },
          {
            id: 'depends',
            emoji: '🤔',
            text: 'Depends what it’s for',
            reply: 'Smart! A pretty picture and scientific evidence need different levels of trust.',
          },
        ],
        partnerPrompt: 'Talk with a partner: should people say when AI changed a photo?',
      },
      quiz: {
        question: 'Why can AI make moon photos clearer?',
        options: [
          { id: 'a', text: 'It removes the camera lens.' },
          { id: 'b', text: 'It changes the moon itself.' },
          { id: 'c', text: 'It learned moon details from many images.' },
        ],
        answer: 'c',
        explanation: 'The more photos you showed the AI, the better it filled in details. The real moon did not change—and some details are AI’s guesses.',
      },
    },

    {
      id: 'mindset',
      type: 'topic',
      icon: '💖',
      name: 'Mindset',
      title: 'Level 4: Food for Thought',
      mascot: 'Beauty filters are fun—but how do we use them in a healthy, fair and respectful way? Let’s think!',
      learn: {
        cards: [
          {
            icon: '⚖️',
            title: 'In moderation',
            text: 'Beauty filters can be fun, but don’t depend on them.',
          },
          {
            icon: '🎁',
            title: 'Unique',
            text: 'Your appearance is unique and valuable.',
          },
          {
            icon: '🌱',
            title: 'Grow',
            text: 'Grow your knowledge, skills, and character.',
          },
        ],
        reading: [],
      },
      activities: [
        {
          type: 'sortGame',
          title: 'Healthy or not?',
          instruction: 'Read each short story. Is it a healthy choice?',
          choices: [
            { id: 'healthy', emoji: '👍', label: 'Healthy' },
            { id: 'unhealthy', emoji: '👎', label: 'Not healthy' },
          ],
          items: [
            {
              id: 'cat-ears',
              emoji: '🐱',
              text: 'On the weekend, I take funny photos with friends using a cat-ears filter.',
              answer: 'healthy',
              tip: 'Using filters for fun sometimes is great!',
            },
            {
              id: 'always-filter',
              emoji: '😟',
              text: 'I’m afraid to let anyone see my photos without a beauty filter.',
              answer: 'unhealthy',
              tip: 'Depending on filters all the time can make you anxious without them.',
            },
            {
              id: 'drawing',
              emoji: '🎨',
              text: 'I practise drawing every day, get better and better, and feel proud.',
              answer: 'healthy',
              tip: 'Growing your skills builds confidence from the inside!',
            },
            {
              id: 'compare',
              emoji: '🪞',
              text: 'I feel sad because my real face doesn’t look like my filtered photos.',
              answer: 'unhealthy',
              tip: 'Your real face is a unique gift!',
            },
          ],
          doneText: 'Remember: use filters in moderation, and grow your knowledge, skills, and character.',
        },
        {
          type: 'fairFilter',
          badge: 'fair',
          title: 'Is this filter fair?',
          instruction: 'Many beauty filters use one idea of “pretty”. Try it on these three kids!',
          applyLabel: '✨ Apply the “pretty” filter',
          faces: [
            { skin: '#8d5524', hair: '#1b1b1b' },
            { skin: '#c68e63', hair: '#3b2a1a', glasses: true },
            { skin: '#f1c27d', hair: '#a0522d' },
          ],
          filterChanges: { skin: '#f8dcc6', faceWidth: 0.86, eyeSize: 1.25, blush: '#f08a9a' },
          question: 'What did the filter change? (pick any)',
          changes: [
            { id: 'skin', text: 'Everyone’s skin got lighter', changed: true },
            { id: 'shape', text: 'Every face got slimmer', changed: true },
            { id: 'eyes', text: 'Every pair of eyes got bigger', changed: true },
            { id: 'hair', text: 'Hair colour changed', changed: false },
          ],
          message: 'The filter made everyone look almost the same—and lighter. But beauty comes in every colour and shape! AI learns from photos people chose, so it can learn unfair ideas too.',
        },
        {
          type: 'sortGame',
          badge: 'fair',
          title: 'Ask first',
          instruction: 'People in photos have feelings too. Do you need to ask first?',
          choices: [
            { id: 'ask', emoji: '🙋', label: 'Ask first' },
            { id: 'ok', emoji: '👌', label: 'OK to do' },
          ],
          items: [
            {
              id: 'friend-photo',
              emoji: '📸',
              text: 'Take a photo of my best friend.',
              answer: 'ask',
              tip: 'Ask: “Can I take your photo?”',
            },
            {
              id: 'edit-sister',
              emoji: '🤪',
              text: 'Put a funny filter on my sister’s photo and send it to the class chat.',
              answer: 'ask',
              tip: 'Always ask before you edit or share someone else’s photo.',
            },
            {
              id: 'own-selfie',
              emoji: '🤳',
              text: 'Take a selfie of myself at home.',
              answer: 'ok',
              tip: 'It’s your own photo—that’s fine!',
            },
            {
              id: 'class-photo',
              emoji: '🏫',
              text: 'Post our class photo online.',
              answer: 'ask',
              tip: 'Lots of people are in it—ask your teacher and classmates first.',
            },
          ],
          doneText: 'Remember: ask before you photograph, edit or share someone else 🙋',
        },
      ],
      think: {
        question: 'When would you NOT use a beauty filter?',
        options: [
          {
            id: 'id-photo',
            emoji: '🪪',
            text: 'For my school ID photo',
            reply: 'Yes! An ID photo must show the real you. Can you think of other times?',
          },
          {
            id: 'family',
            emoji: '👨‍👩‍👧',
            text: 'Video calls with family',
            reply: 'Your family loves the real you! Some think a funny filter to make them laugh is fine too.',
          },
          {
            id: 'doctor',
            emoji: '🩺',
            text: 'A photo for the doctor',
            reply: 'Very thoughtful! A doctor needs to see the real picture to help.',
          },
          {
            id: 'always',
            emoji: '✨',
            text: 'I’d always use one',
            reply: 'Thanks for being honest! But ID photos or photos for a doctor may need to be real. What do you think?',
          },
        ],
        partnerPrompt: 'Talk with a partner: what’s great about you without any filter?',
      },
      quiz: {
        question: 'What is a healthy way to view beauty filters?',
        options: [
          { id: 'a', text: 'Stop caring about learning or character.' },
          { id: 'b', text: 'Use them constantly and never show your real face.' },
          { id: 'c', text: 'Use them moderately and focus on inner growth.' },
        ],
        answer: 'c',
        explanation: 'Using filters moderately is fine; real confidence comes from knowledge, skills, and character.',
      },
    },

    {
      id: 'finish',
      type: 'finish',
      icon: '🏆',
      name: 'Finish',
      mascot: 'You finished every level! Look at what you learned—and your own ideas.',
      title: 'Summary',
      takeaways: [
        {
          icon: '🖼️',
          text: 'Beauty filters evolved from darkroom edits to AI.',
        },
        {
          icon: '💄',
          text: 'AI transfers makeup by recognising face parts and makeup.',
        },
        {
          icon: '💖',
          text: 'A healthy mindset matters more than looks.',
        },
        {
          icon: '🧪',
          text: 'AI can be wrong or invent details—always think twice.',
        },
        {
          icon: '🤝',
          text: 'Ask before you photograph or edit someone else.',
        },
        {
          icon: '🌱',
          text: 'Use AI only when needed—it saves energy.',
        },
      ],
      badge: 'Beauty Camera Expert',
    },
  ],
}
