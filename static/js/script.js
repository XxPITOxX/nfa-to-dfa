function generateTable() {
    const states = document.getElementById('states-input').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('alphabet-input').value.split(',').map(s => s.trim()).filter(s => s);
    const header = document.getElementById('table-header');
    const body = document.getElementById('table-body');
    
    header.innerHTML = '<th>Q</th><th>S</th><th>F</th>';
    alphabet.forEach(symbol => header.innerHTML += `<th>${symbol}</th>`);
    header.innerHTML += '<th>λ</th>';

    body.innerHTML = '';
    states.forEach((state, index) => {
        let row = `<tr>
            <td>${state}</td>
            <td><input type="radio" name="start-radio" value="${state}" ${index===0?'checked':''}></td>
            <td><input type="checkbox" class="final-check" value="${state}"></td>`;
        alphabet.forEach(symbol => {
            row += `<td><input type="text" class="cell-input" data-state="${state}" data-symbol="${symbol}"></td>`;
        });
        row += `<td><input type="text" class="cell-input" data-state="${state}" data-symbol="lambda"></td></tr>`;
        body.innerHTML += row;
    });
}

function convertNFA() {
    const states = document.getElementById('states-input').value.split(',').map(s => s.trim()).filter(s => s);
    const alphabet = document.getElementById('alphabet-input').value.split(',').map(s => s.trim()).filter(s => s);
    const startState = document.querySelector('input[name="start-radio"]:checked')?.value;
    const finalStates = Array.from(document.querySelectorAll('.final-check:checked')).map(cb => cb.value);
    
    const transitions = {};
    states.forEach(state => {
        transitions[state] = {};
        [...alphabet, 'lambda'].forEach(symbol => {
            const input = document.querySelector(`.cell-input[data-state="${state}"][data-symbol="${symbol}"]`);
            const targets = input.value ? input.value.split(',').map(s => s.trim()).filter(s => s) : [];
            if (targets.length > 0) transitions[state][symbol] = targets;
        });
    });

    fetch('/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nfa: { start_state: startState, final_states: finalStates, alphabet, transitions } })
    })
    .then(res => res.json())
    .then(data => renderGraph(data.nodes, data.edges));
}

function renderGraph(nodes, edges) {
    const container = document.getElementById('network-container');
    const options = {
        edges: { arrows: { to: { enabled: true } }, color: '#7ba8d2', smooth: { type: 'curvedCW', roundness: 0.2 } },
        nodes: { shape: 'circle', font: { color: '#333' }, color: { background: '#fff', border: '#7ba8d2' } },
        physics: { enabled: true, solver: 'forceAtlas2Based' }
    };
    const network = new vis.Network(container, { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) }, options);
    network.once('stabilizationIterationsDone', () => network.setOptions({ physics: false }));
}

function resetAll() {
    document.getElementById('states-input').value = "";
    document.getElementById('alphabet-input').value = "";
    generateTable();
    const container = document.getElementById('network-container');
    container.innerHTML = ""; 
    document.getElementById('states-input').focus();
}

window.onload = function() {
    document.getElementById('states-input').value = "q0, q1, q2";
    document.getElementById('alphabet-input').value = "a, b";
    generateTable();
};