from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def get_lambda_closure(states, transitions):
    closure = set(states)
    stack = list(states)
    while stack:
        q = stack.pop()
        for next_state in transitions.get(q, {}).get('lambda', []):
            if next_state not in closure:
                closure.add(next_state)
                stack.append(next_state)
    return closure

def get_move(states, symbol, transitions):
    res = set()
    for state in states:
        if state in transitions and symbol in transitions[state]:
            res.update(transitions[state][symbol])
    return res

def nfa_to_dfa_logic(nfa):
    start_closure = get_lambda_closure({nfa['start_state']}, nfa['transitions'])
    
    dfa_states = [start_closure]
    dfa_transitions = {}
    worklist = [start_closure]
    
    while worklist:
        current_dfa_state = worklist.pop(0)
        state_key = tuple(sorted(current_dfa_state))
        dfa_transitions[state_key] = {}
        
        for symbol in nfa['alphabet']:
            next_state_set = get_lambda_closure(
                get_move(current_dfa_state, symbol, nfa['transitions']), 
                nfa['transitions']
            )
            
            if not next_state_set:
                continue
            
            next_state_tuple = tuple(sorted(next_state_set))
            if next_state_tuple not in [tuple(sorted(s)) for s in dfa_states]:
                dfa_states.append(next_state_set)
                worklist.append(next_state_set)
            
            dfa_transitions[state_key][symbol] = tuple(sorted(next_state_set))

    dfa_final_states = []
    for state_set in dfa_states:
        if any(s in nfa['final_states'] for s in state_set):
            dfa_final_states.append(tuple(sorted(state_set)))
            
    return {
        "states": [tuple(sorted(s)) for s in dfa_states],
        "transitions": dfa_transitions,
        "final_states": dfa_final_states
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert():
    try:
        nfa_data = request.json['nfa']
        result = nfa_to_dfa_logic(nfa_data)
        
        formatted_nodes = []
        for s in result['states']:
            label = "{" + ",".join(s) + "}" if s else "Ø"
            is_final = s in result['final_states']
            
            node_style = {
                "id": str(s), 
                "label": label,
                "borderWidth": 6 if is_final else 2,
                "color": {
                    "border": "#2B7CE9" if is_final else "#7ba8d2",
                    "background": "#D2E5FF" if is_final else "#ffffff",
                }
            }
            formatted_nodes.append(node_style)
            
        formatted_edges = []
        for from_state, trans in result['transitions'].items():
            for symbol, to_state in trans.items():
                formatted_edges.append({"from": str(from_state), "to": str(to_state), "label": symbol})

        return jsonify({"nodes": formatted_nodes, "edges": formatted_edges})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)