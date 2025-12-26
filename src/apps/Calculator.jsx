import { useState } from 'react';

const CalculatorApp = () => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handlePress = (val) => {
        if (val === 'C') {
            setDisplay('0');
            setEquation('');
        } else if (val === '=') {
            try {
                const result = Function('"use strict";return (' + equation + display + ')')();
                // Fix floating point precision issues (e.g. 0.1 + 0.2)
                // Use 15 significant digits to strip floating point noise while preserving
                // as much precision as possible for large numbers.
                const preciseResult = Number.isInteger(result)
                    ? result
                    : parseFloat(result.toPrecision(15));
                setDisplay(String(preciseResult));
                setEquation('');
            } catch (e) {
                setDisplay('ERR');
            }
        } else if (['+', '-', '*', '/'].includes(val)) {
            setEquation(display + val);
            setDisplay('0');
        } else {
            setDisplay(display === '0' ? val : display + val);
        }
    };

    const btnClass = "h-12 border border-gray-800 bg-[var(--color-surface)]/50 text-[var(--color-blue)] hover:bg-[var(--color-yellow)] hover:text-black font-bold text-lg transition-colors";

    return (
        <div className="h-full flex flex-col p-4 bg-black">
            <div className="bg-[var(--color-surface)] border border-gray-700 p-4 mb-4 text-right font-mono">
                <div className="text-xs text-gray-500 h-4">{equation}</div>
                <div className="text-3xl text-[var(--color-yellow)] font-bold tracking-widest">{display}</div>
            </div>
            <div className="grid grid-cols-4 gap-2 flex-1">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(btn => (
                    <button key={btn} onClick={() => handlePress(btn)} className={btnClass}>
                        {btn}
                    </button>
                ))}
                <button onClick={() => handlePress('C')} className={`${btnClass} col-span-4 border-[var(--color-red)] text-[var(--color-red)]`}>CLEAR_MEMORY</button>
            </div>
        </div>
    );
};

export default CalculatorApp;
