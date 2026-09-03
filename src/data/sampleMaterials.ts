export interface SampleMaterial {
  id: string;
  title: string;
  subject: string;
  category: 'physics' | 'programming' | 'biology' | 'math' | 'general';
  suggestedPrompt: string;
  defaultTime: 2 | 5 | 10 | 15 | 20;
  contentSnippet: string;
}

export const SAMPLE_MATERIALS: SampleMaterial[] = [
  {
    id: 'physics-ohms-law',
    title: 'Chapter 4: Ohm\'s Law and Electrical Networks',
    subject: 'Physics',
    category: 'physics',
    suggestedPrompt: 'I am a beginner. Teach me Ohm\'s Law in a brisk 5-minute lesson using simple visual analogies and quick interactive checks.',
    defaultTime: 5,
    contentSnippet: `Chapter 4: Direct Current and Ohm\'s Law
4.1 Electric Potential Difference (Voltage, V):
The work done per unit charge in moving a test charge between two points in an electrostatic field. Measured in Volts (V).
4.2 Electric Current (I):
The rate of net charge flow through a cross-sectional area per second: I = dQ/dt. Measured in Amperes (A).
4.3 Electrical Resistance (R):
The opposition offered by a substance to the flow of electric current. Georg Simon Ohm established that for a conductor at constant temperature, current is directly proportional to voltage and inversely proportional to resistance: V = I * R.
4.4 Misconception Alert:
Students frequently assume that increasing resistance increases current because the power source has to work harder. In fact, resistance restricts charge drift; thus current must decrease.`,
  },
  {
    id: 'cs-react-state',
    title: 'Module 3: React Declarative State Architecture',
    subject: 'Computer Science',
    category: 'programming',
    suggestedPrompt: 'Teach me React State in 5 minutes. Focus on useState, immutability, and batching with practical code snippets.',
    defaultTime: 5,
    contentSnippet: `Module 3: React State & The Reconciliation Cycle
3.1 The Declarative Model: UI = f(State)
Unlike imperative DOM manipulation, React components are pure projections of state. When state updates, React constructs a new virtual DOM tree and reconciles changes via fiber diffing.
3.2 Immutability Rules:
Direct mutations (e.g. state.push(x)) fail to trigger re-renders because object reference equality does not change. Always provide shallow copies (...prev).
3.3 Batching and Asynchronous Execution:
React batches state updates within event handlers and promises. Accessing state immediately after calling its setter reflects the snapshot of the current render, not the upcoming one.`,
  },
  {
    id: 'math-calculus',
    title: 'Unit 2: Differential Calculus & Rates of Change',
    subject: 'Mathematics',
    category: 'math',
    suggestedPrompt: 'Explain Derivatives to a beginner using geometric slope analogies and step-by-step curves.',
    defaultTime: 20,
    contentSnippet: `Unit 2: The Derivative as Instantaneous Velocity
2.1 Limits and Secant Lines:
As the interval delta-x shrinks to zero, the secant line passing through two points approaches the tangent line.
2.2 The Formal Definition:
f\'(x) = lim_{h -> 0} [f(x+h) - f(x)] / h.
2.3 The Power Rule:
d/dx [x^n] = n * x^(n-1). Geometric interpretation: instantaneous slope of the curve at coordinate x.`,
  },
  {
    id: 'biology-respiration',
    title: 'Chapter 8: Cellular Respiration & ATP Synthase',
    subject: 'Biology',
    category: 'biology',
    suggestedPrompt: 'Teach me how Mitochondria generate ATP. Use labeled structural diagrams and energetic analogies.',
    defaultTime: 20,
    contentSnippet: `Chapter 8: Metabolic Pathways and Cellular Respiration
8.1 Glycolysis in Cytoplasm:
Splitting glucose (C6H12O6) into two pyruvate molecules, yielding net 2 ATP and 2 NADH.
8.2 The Krebs Cycle:
Acetyl-CoA oxidation in mitochondrial matrix producing carbon dioxide, ATP, and high-energy electron carriers (NADH, FADH2).
8.3 Electron Transport Chain & Chemiosmosis:
Proton pump complexes pump H+ ions into intermembrane space. The proton motive force drives ATP Synthase like a microscopic turbine.`,
  },
];
