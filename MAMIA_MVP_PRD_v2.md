x11x1# MAMIA MVP - Product Requirements Document v2.0

**Cultural Cooking Companion with Voice-First AI Mamas**

---

## 🎯 Executive Summary

MAMIA is a revolutionary voice-first cooking companion app featuring authentic cultural 'mamas' who guide users through traditional recipes with natural conversation, step-by-step voice guidance, and cultural storytelling. Building on successful UI/UX prototypes, this version focuses on robust backend integration with ElevenLabs Conversational AI and enhanced recipe management.

### Core Innovation
- **Multi-Cultural Character Carousel**: Choose from 3 authentic mama figures
- **ElevenLabs Conversational AI**: Natural voice conversations during cooking
- **Smart Shopping Integration**: Intelligent ingredient management and sharing
- **Cultural Authenticity**: Real expressions, stories, and cooking wisdom

---

## 🏗️ Product Architecture

### Character System
**Core Characters (Permanent)**:
1. **Nonna Lucia** (Italian) 🍷 - Warm terracotta theme
2. **Abuela Rosa** (Mexican) 🌶️ - Vibrant red theme  
3. **Yai Malee** (Thai) 🌿 - Fresh green theme

**Guest Characters (Guest Characters TBA but wanting the structure to support Rotating)**:
- **Tante Marie** (French) - Future guest
- **Nani Priya** (Indian) - Future guest
- **Obaa-chan Yuki** (Japanese) - Future guest

**Scalable Character Architecture**:
- Unified character interface for core + guests
- Dynamic cookbook generation per character
- Modular voice integration (ElevenLabs voice ID per character)
- Flexible theming system for new cultures
- Add/remove characters without code changes

### Navigation Structure
```
/                     - Character carousel selection
/mama/{mamaId}        - Individual mama's cookbook
/recipe/{recipeId}    - Detailed recipe view with prep
/cook/{recipeId}      - Voice-guided cooking mode
/kitchen              - Personal space (shopping list, favorites, history)
/profile              - Profile, settings, subscription, sign out
/auth                 - Authentication flow
```

### Navigation Architecture
- **4-Tab Bottom Navigation**: Mamas, Recipes, Cook, My Kitchen
- **Top-Right Profile Dropdown**: Profile settings, subscription management, sign out
- **Scalable Character System**: Core mamas + rotating guest mamas

---

## 🎨 UI/UX Design System

### Mobile-First Design
- **Character Carousel**: Embla carousel with character cards (85% width)
- **Large Touch Targets**: Minimum 48px for kitchen use
- **Progress Dots**: Visual indicators for carousel navigation
- **Bottom Navigation**: 4-tab structure (Mamas, Recipes, Cook, My Kitchen)
- **Profile Dropdown**: Top-right access to settings and account management
- **Cookbook**: Each Mama has their own cookbook, styled uniquely to character
- **Swipeable Recipes**: At the bottom of the Recipe tab is a 'stack' of recipes, user swipes like tinder

### Cultural Color Themes
```css
Italian (Nonna Lucia):
- Primary: Warm terracotta #E35336
- Secondary: Tuscan gold #D4AF37
- Background: Soft cream #FFF8DC

Mexican (Abuela Rosa):  
- Primary: Vibrant red #CC3333
- Secondary: Warm orange #FF6347
- Background: Warm cream variations

Thai (Yai Malee):
- Primary: Fresh green #228B22
- Secondary: Sage green #9CAF88
- Background: Light green tints
```

### Typography
- **Headers**: Playfair Display (elegant, cultural)
- **Body**: Nunito (readable, friendly)
- **Accent**: Dancing Script (handwritten feel)

---

## 🔊 Voice Integration System

### ElevenLabs Conversational AI
**Implementation**:
- **Voice Synthesis**: Premium voices for each mama
- **Natural Conversation**: Context-aware responses during cooking
- **Command Recognition**: "Next step", "Repeat", "Help me"
- **Text Mama Feature**: Fallback text chat for queries

**Voice Workflow**:
1. **Welcome Audio**: Personalized greeting per recipe selection
2. **Step-by-Step**: Voice guidance with cultural personality
3. **Interactive Help**: Natural conversation for cooking questions
4. **Cultural Stories**: Integrated storytelling during prep/cook time

### Voice Commands
- **Navigation**: "Next step", "Previous step", "Repeat"
- **Help**: "Help me", "What do I do now?", "Tips"
- **Information**: "Ingredients", "Time remaining", "What's next?"
- **Conversational**: Open-ended questions about techniques, substitutions

---

## 📖 Enhanced Recipe Structure

### Recipe Data Model
```typescript
interface Recipe {
  id: string;
  mamaId: string;
  title: string;
  description: string;
  cookingTime: string;
  prepTimeMin?: number;
  cookTimeMin: number;
  servings: number;
  difficulty: 'EASY' | 'MEDIUM' | 'ADVANCED';
  category: 'QUICK' | 'EVERYDAY' | 'WEEKEND' | 'CELEBRATION';
  contentType: 'VEGETARIAN' | 'MEAT' | 'FISH' | 'VEGAN';
  
  // Enhanced Features
  ingredients: Ingredient[];
  instructions: Instruction[];
  featured?: boolean;
  
  // Voice Integration
  voiceIntro: string;          // Opening greeting
  displayTips: string[];       // Basic tips shown in UI
  voiceTips: string[];       // Premium tips spoken
  stepVoiceTips: Record<number, string>; // Step-specific guidance
  
  // Cultural Context
  culturalContext?: string;    // Story behind the dish
  equipment?: string[];        // Required tools
  storageInstructions?: string;
  
  // Timer Integration
  stepTimers?: (StepTimer | null)[];
}

interface StepTimer {
  display: string;            // "5 min"
  duration: number;          // seconds
  description?: string;      // "Until garlic is fragrant"
}
```

### Cultural Recipe Collections
**15 Recipes Total** (5 per mama):
- **Nonna Lucia**: Carbonara, Chicken Cacciatore, Homemade Lasagna, Osso Buco, Penne Arrabbiata
- **Abuela Rosa**: Quesadillas, Chicken Tinga, Enchiladas Verdes, Pozole Rojo, Mole Poblano  
- **Yai Malee**: Pad Krapao, Green Curry, Pad Thai, Khao Soi, Massaman Beef

---

## 🛒 Smart Shopping List Features

### Shopping List Management
- **Auto-Generation**: Extract ingredients from selected recipes
- **Smart Categorization**: Group by store sections (produce, dairy, etc.)
- **Quantity Consolidation**: Combine duplicate ingredients intelligently
- **Drag & Drop**: Reorder items and mark complete
- **Share Feature**: Export/share lists via text or email

### Shopping List Context
```typescript
interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
  category: string;           // "produce", "dairy", "pantry"
  recipeSource?: string;      // Which recipe added this
  completed: boolean;
  notes?: string;
}
```

### Integration Features
- **Recipe-to-List**: Add all ingredients from recipe view
- **Cross-Recipe**: Combine ingredients from multiple recipes
- **Store Categories**: Auto-categorize for efficient shopping
- **Offline Support**: Works without internet connection

---

## 🔧 Technical Implementation

### Core Technologies
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom cultural themes
- **Navigation**: React Router with mobile-optimized transitions
- **State**: React Context + Local Storage (no backend initially)
- **Voice**: ElevenLabs Conversational AI API
- **UI Components**: shadcn/ui with custom cultural adaptations

### Data Architecture
```
/src
├── data/
│   ├── mamas.ts          # Character definitions
│   ├── recipes.ts        # Recipe collections
│   └── categories.ts     # Shopping categories
├── components/
│   ├── ui/               # Base components
│   ├── character/        # Mama-specific components
│   ├── voice/            # Voice interface components
│   └── shopping/         # Shopping list components
├── contexts/
│   ├── ShoppingListContext.tsx
│   ├── AuthContext.tsx   # Future auth integration
│   └── VoiceContext.tsx  # Voice state management
├── hooks/
│   ├── useVoice.tsx      # ElevenLabs integration
│   ├── useConversation.tsx
│   └── useShoppingList.tsx
└── services/
    ├── voiceService.ts   # ElevenLabs API
    ├── conversationService.ts
    └── sharingService.ts # List sharing
```

### Performance Requirements
- **Initial Load**: < 3 seconds on mobile
- **Voice Response**: < 2 seconds from ElevenLabs
- **Carousel Smoothness**: 60fps transitions
- **Offline Capability**: Core features work without internet

---

## 🚀 Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Project setup with Vite + React + TypeScript
- [ ] Core UI components and cultural theming
- [ ] Character carousel with embla-carousel
- [ ] Basic navigation structure
- [ ] Recipe data integration

### Phase 2: Voice Integration (Week 2) 
- [ ] ElevenLabs API integration
- [ ] Voice service architecture
- [ ] Basic cooking mode with voice guidance
- [ ] Text Mama fallback feature
- [ ] Voice command recognition

### Phase 3: Recipe Enhancement (Week 3)
- [ ] Enhanced recipe structure implementation
- [ ] Step-by-step cooking interface
- [ ] Timer integration with voice prompts
- [ ] Cultural story integration
- [ ] Recipe sharing features

### Phase 4: Shopping Intelligence (Week 4)
- [ ] Smart shopping list generation
- [ ] Ingredient categorization
- [ ] List sharing functionality  
- [ ] Cross-recipe consolidation
- [ ] Offline storage optimization

### Phase 5: Polish & Demo (Week 5)
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Demo mode preparation
- [ ] Error handling and fallbacks
- [ ] Mobile responsiveness testing

---

## 📊 Success Metrics

### User Experience KPIs
- **Character Selection**: Users try multiple mamas
- **Voice Engagement**: > 70% of cooking sessions use voice
- **Recipe Completion**: Users finish full cooking processes
- **Shopping List Usage**: Generated lists are actually used
- **Session Duration**: Extended cooking sessions (> 15 minutes)

### Technical Performance
- **Voice Latency**: < 2 seconds response time
- **App Performance**: Smooth 60fps animations
- **Error Rate**: < 5% voice synthesis failures
- **Load Times**: < 3 seconds initial app load

### Cultural Authenticity
- **Voice Quality**: Natural, culturally appropriate speech
- **Recipe Accuracy**: Traditional, authentic preparations
- **User Feedback**: Positive cultural representation

---

## 🎯 Competitive Differentiation

### Unique Value Propositions
1. **Multi-Cultural Characters**: 3 authentic mamas vs single-culture apps
2. **Conversational AI**: Natural voice interaction vs basic TTS
3. **Cultural Storytelling**: Recipe context and family stories
4. **Smart Shopping**: Intelligent list management across recipes
5. **Character Carousel**: Engaging visual selection interface

### Market Positioning
- **Primary**: Cultural cooking enthusiasts seeking authentic guidance
- **Secondary**: Voice-first cooking app users
- **Tertiary**: Meal planning and shopping list users

---

## 🔮 Future Roadmap

### Post-MVP Features
- **Additional Characters**: Indian (Nani), Japanese (Obaa-chan), Lebanese (Teta)
- **User Accounts**: Save progress, favorites, custom lists
- **Social Features**: Share cooking achievements, recipe ratings
- **Ingredient Substitution**: AI-powered alternative suggestions  
- **Video Integration**: Character animations during cooking
- **Meal Planning**: Weekly menu planning with shopping lists

### Monetization Strategy
- **Freemium Model**: 3 free recipes per character
- **Premium Subscription**: Full recipe collections, advanced features
- **Character Packs**: Additional cultural mamas
- **Shopping Integration**: Grocery delivery partnerships

---

This PRD establishes MAMIA as a revolutionary cultural cooking companion that combines authentic voice AI, smart shopping features, and engaging character-driven experiences to transform how people learn traditional cooking.