1. PROJECT OVERVIEW

The NFA to DFA Visualizer is a web-based application designed to convert Non-deterministic Finite Automata (NFA) into Deterministic Finite Automata (DFA) through an interactive and visual interface.

2. FEATURES

- Dynamic Transition Table: Generates an input table based on the user-defined states and characters.
- Lambda Transition Support: Handles λ transitions during the conversion process.
- Interactive Visualization: Renders the DFA as a node-link diagram where users can move states around.
- Final State Detection: Automatically identifies and highlights accepting states in the converted DFA.
- Clean UI: A specialized interface designed for focused automata manipulation.

3. TECH STACK

- Backend: Python (Flask Framework)
- Frontend: HTML, CS, JavaScript
- Visualization: vis-network.js (Graph rendering)
- Algorithm: Subset Construction (Power Set Construction)

4. INSTALLATION & SETUP

To run this project locally, follow these steps:

Step 1: Install Python (if not already installed).
Step 2: Install the Flask dependency:
        pip install flask

Step 3: Navigate to the project directory and run the application:
        python app.py

Step 4: Open your web browser and go to:
        http://127.0.0.1:5000

5. HOW TO USE

Step 1.  Enter States: Input the list of NFA states separated by commas (e.g., q0, q1, q2) in the top input field.
Step 2.  Enter Characters: Input the symbols separated by commas (e.g., a, b or 0, 1).
Step 3.  Fill Transition Table: 
    - Select the Start State (radio button).
    - Mark Final States (checkboxes).
    - Enter transition targets (e.g., q1, q2) for each symbol.
    - Use the 'lambda' column for ε-transitions.
Step 4.  Convert: Click the "Convert" button to generate the DFA graph.
Step 5.  Reset: Use the "Reset" button to clear all inputs.

6. LOGIC DETAILS

The backend (app.py) implements the following:
- get_lambda_closure: Computes the set of states reachable via lambda transitions.
- get_move: Finds the set of states reachable from a current set on a specific input symbol.
- nfa_to_dfa_logic: The core algorithm that maps NFA state sets to unique DFA states.