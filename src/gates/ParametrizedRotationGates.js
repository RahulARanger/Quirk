/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {GateBuilder} from "../circuit/Gate.js"
import {GatePainting} from "../draw/GatePainting.js"
import {Complex, PARSE_COMPLEX_TOKEN_MAP_RAD} from "../math/Complex.js"
import {Matrix} from "../math/Matrix.js"
import {ketArgs, ketShader, ketShaderPhase, ketInputGateShaderCode} from "../circuit/KetShaderUtil.js"
import {WglArg} from "../webgl/WglArg.js"
import {Util} from "../base/Util.js";
import {parseFormula} from "../math/FormulaParser.js";
import {XExp, YExp, ZExp} from "./ExponentiatingGates.js";
import {Config} from "../Config.js";
import {showPrompt} from "../ui/dialogs.js";

let ParametrizedRotationGates = {};

/**
 * @param {!string} pattern
 * @param {!int} xyz
 * @param {!number} tScale
 * @returns {!function(args: !GateDrawParams)}
 */
function configurableRotationDrawer(pattern, xyz, tScale) {
    let xScale = [1, 0.5, -1][xyz];
    let yScale = [1, 1, -0.5][xyz];
    return args => {
        GatePainting.paintBackground(args, Config.TIME_DEPENDENT_HIGHLIGHT_COLOR);
        GatePainting.paintOutline(args);
        let text = pattern;
        if (!args.isInToolbox) {
            text = text.split('f(t)').join(args.gate.param);
        }
        GatePainting.paintGateSymbol(args, text, pattern.indexOf('^') !== -1);
        GatePainting.paintGateButton(args);

        let isStable = args.gate.stableDuration() === Infinity;
        if ((!args.isInToolbox || args.isHighlighted) && !isStable) {
            let rads = tScale * parseTimeFormula(args.gate.param, args.stats.time*2-1, false) || 0;
            GatePainting.paintCycleState(args, rads, xScale, yScale);
        }
    };
}

/**
 * @param {!string} formula
 * @param {undefined|!number} time
 * @param {!boolean} warn
 * @returns {undefined|!{theta: !number, phi: !number}}
 */
function parseRxyFormula(formula, time, warn) {
    if (typeof formula !== 'string') {
        return undefined;
    }
    let parts = formula.split(',');
    if (parts.length !== 2) {
        if (warn) {
            console.warn('RXY expects two comma-separated formulas: theta, phi');
        }
        return undefined;
    }
    let theta = parseTimeFormula(parts[0].trim(), time, warn);
    let phi = parseTimeFormula(parts[1].trim(), time, warn);
    return theta === undefined || phi === undefined ? undefined : {theta, phi};
}

/**
 * @param {!number} theta Rotation angle in radians.
 * @param {!number} phi Axis angle in radians, measured from +X toward +Y.
 * @returns {!Matrix}
 */
function rxyMatrix(theta, phi) {
    let fraction = theta / (2 * Math.PI);
    return Matrix.fromPauliRotation(
        fraction * Math.cos(phi),
        fraction * Math.sin(phi),
        0);
}

/**
 * @param {!number} theta Rotation angle in radians.
 * @returns {!Matrix}
 */
function rxxMatrix(theta) {
    let c = Math.cos(theta / 2);
    let s = Math.sin(theta / 2);
    let xx = Matrix.PAULI_X.tensorProduct(Matrix.PAULI_X);
    return Matrix.identity(4).times(c).plus(xx.times(new Complex(0, -s)));
}

/**
 * @param {!GateDrawParams} args
 */
function rxyDrawer(args) {
    GatePainting.paintBackground(args, Config.TIME_DEPENDENT_HIGHLIGHT_COLOR);
    GatePainting.paintOutline(args);
    let text = args.isInToolbox ? 'RXY' : `RXY(${args.gate.param})`;
    GatePainting.paintGateSymbol(args, text);
    GatePainting.paintGateButton(args);

    let isStable = args.gate.stableDuration() === Infinity;
    if ((!args.isInToolbox || args.isHighlighted) && !isStable) {
        let parsed = parseRxyFormula(args.gate.param, args.stats.time*2-1, false);
        if (parsed !== undefined) {
            GatePainting.paintCycleState(
                args,
                parsed.theta,
                Math.cos(parsed.phi),
                Math.sin(parsed.phi));
        }
    }
}

/**
 * @param {!GateDrawParams} args
 */
function exponent_to_A_len_painter(args) {
    let v = args.getGateContext('Input Range A');
    let denom_exponent = v === undefined ? 'ⁿ' : Util.digits_to_superscript_digits('' + v.length);
    let symbol = args.gate.symbol.replace('ⁿ', denom_exponent);
    GatePainting.paintBackground(args);
    GatePainting.paintOutline(args);
    GatePainting.paintGateSymbol(args, symbol);
}

const X_TO_A_SHADER = ketShader(
    `
        uniform float factor;
        ${ketInputGateShaderCode('A')}
    `,
    `
        float angle = read_input_A() * factor / _gen_input_span_A;
        float c = cos(angle) * 0.5;
        float s = sin(angle) * 0.5;
        vec2 u = vec2(0.5 + c, s);
        vec2 v = vec2(0.5 - c, -s);
        // multiply state by the matrix [[u, v], [v, u]]
        vec2 amp2 = inp(1.0-out_id);
        return cmul(u, amp) + cmul(v, amp2);
    `);

const Y_TO_A_SHADER = ketShader(
    `
        uniform float factor;
        ${ketInputGateShaderCode('A')}
    `,
    `
        float angle = read_input_A() * factor / _gen_input_span_A;
        float c = cos(angle) * 0.5;
        float s = sin(angle) * 0.5;
        vec2 u = vec2(c + 0.5, s);
        vec2 v = vec2(s, 0.5 - c);
        // multiply state by the matrix [[u, v], [-v, u]]
        vec2 amp2 = inp(1.0-out_id);
        vec2 vs = v * (-1.0 + 2.0 * out_id);
        return cmul(u, amp) + cmul(vs, amp2);
    `);

const Z_TO_A_SHADER = ketShaderPhase(
    `
        uniform float factor;
        ${ketInputGateShaderCode('A')}
    `,
    `
        return read_input_A() * out_id * factor / _gen_input_span_A;
    `);

ParametrizedRotationGates.XToA = new GateBuilder().
    setSerializedId("X^(A/2^n)").
    setSymbol("X^A/2ⁿ").
    setTitle("Parametrized X Gate").
    setBlurb("Rotates the target by input A / 2ⁿ'th of a half turn around the X axis.\n" +
        "n is the number of qubits in input A.").
    setRequiredContextKeys('Input NO_DEFAULT Range A').
    setDrawer(exponent_to_A_len_painter).
    setActualEffectToShaderProvider(ctx => X_TO_A_SHADER.withArgs(
        ...ketArgs(ctx, 1, ['A']),
        WglArg.float('factor', Math.PI))).
    promiseEffectIsStable().
    promiseEffectIsUnitary().
    gate;

ParametrizedRotationGates.XToMinusA = new GateBuilder().
    setAlternate(ParametrizedRotationGates.XToA).
    setSerializedId("X^(-A/2^n)").
    setSymbol("X^-A/2ⁿ").
    setTitle("Parametrized -X Gate").
    setBlurb("Counter-rotates the target by input A / 2ⁿ'th of a half turn around the X axis.\n" +
        "n is the number of qubits in input A.").
    setRequiredContextKeys('Input NO_DEFAULT Range A').
    setDrawer(exponent_to_A_len_painter).
    setActualEffectToShaderProvider(ctx => X_TO_A_SHADER.withArgs(
        ...ketArgs(ctx, 1, ['A']),
        WglArg.float('factor', -Math.PI))).
    promiseEffectIsStable().
    promiseEffectIsUnitary().
    gate;

ParametrizedRotationGates.YToA = new GateBuilder().
    setSerializedId("Y^(A/2^n)").
    setSymbol("Y^A/2ⁿ").
    setTitle("Parametrized Y Gate").
    setBlurb("Rotates the target by input A / 2ⁿ'th of a half turn around the Y axis.\n" +
        "n is the number of qubits in input A.").
    setRequiredContextKeys('Input NO_DEFAULT Range A').
    setDrawer(exponent_to_A_len_painter).
    setActualEffectToShaderProvider(ctx => Y_TO_A_SHADER.withArgs(
        ...ketArgs(ctx, 1, ['A']),
        WglArg.float('factor', Math.PI))).
    promiseEffectIsStable().
    promiseEffectIsUnitary().
    gate;

ParametrizedRotationGates.YToMinusA = new GateBuilder().
    setAlternate(ParametrizedRotationGates.YToA).
    setSerializedId("Y^(-A/2^n)").
    setSymbol("Y^-A/2ⁿ").
    setTitle("Parametrized -Y Gate").
    setBlurb("Counter-rotates the target by input A / 2ⁿ'th of a half turn around the Y axis.\n" +
        "n is the number of qubits in input A.").
    setRequiredContextKeys('Input NO_DEFAULT Range A').
    setDrawer(exponent_to_A_len_painter).
    setActualEffectToShaderProvider(ctx => Y_TO_A_SHADER.withArgs(
        ...ketArgs(ctx, 1, ['A']),
        WglArg.float('factor', -Math.PI))).
    promiseEffectIsStable().
    promiseEffectIsUnitary().
    gate;

ParametrizedRotationGates.ZToA = new GateBuilder().
    setSerializedId("Z^(A/2^n)").
    setSymbol("Z^A/2ⁿ").
    setTitle("Parametrized Z Gate").
    setBlurb("Rotates the target by input A / 2ⁿ'th of a half turn around the Z axis.\n" +
        "n is the number of qubits in input A.").
    setRequiredContextKeys('Input NO_DEFAULT Range A').
    setDrawer(exponent_to_A_len_painter).
    setActualEffectToShaderProvider(ctx => Z_TO_A_SHADER.withArgs(
        ...ketArgs(ctx, 1, ['A']),
        WglArg.float('factor', Math.PI))).
    promiseEffectIsStable().
    promiseEffectOnlyPhases().
    gate;

ParametrizedRotationGates.ZToMinusA = new GateBuilder().
    setAlternate(ParametrizedRotationGates.ZToA).
    setSerializedId("Z^(-A/2^n)").
    setSymbol("Z^-A/2ⁿ").
    setTitle("Parametrized -Z Gate").
    setBlurb("Counter-rotates the target by input A / 2ⁿ'th of a half turn around the Z axis.\n" +
        "n is the number of qubits in input A.").
    setRequiredContextKeys('Input NO_DEFAULT Range A').
    setDrawer(exponent_to_A_len_painter).
    setActualEffectToShaderProvider(ctx => Z_TO_A_SHADER.withArgs(
        ...ketArgs(ctx, 1, ['A']),
        WglArg.float('factor', -Math.PI))).
    promiseEffectIsStable().
    promiseEffectOnlyPhases().
    gate;

/**
 * @param {!string} formula
 * @param {undefined|!number} time
 * @param {!boolean} warn
 * @returns {undefined|!number}
 */
function parseTimeFormula(formula, time, warn) {
    let tokenMap = new Map([...PARSE_COMPLEX_TOKEN_MAP_RAD.entries()]);
    if (time !== undefined) {
        tokenMap.set('t', time);
    }
    try {
        let angle = Complex.from(parseFormula(formula, tokenMap));
        if (Math.abs(angle.imag) > 0.0001) {
            throw new Error(`Non-real angle: ${formula} = ${angle}`);
        }
        return angle.real;
    } catch (ex) {
        if (warn) {
            console.warn(ex);
        }
        return undefined;
    }
}

/**
 * @param {!GateCheckArgs} args
 * @returns {undefined|!string}
 */
function badFormulaDetector(args) {
    if (typeof args.gate.param === 'number') {
        return args.gate.param;
    } else if (typeof args.gate.param === 'string') {
        for (let t of [0.01, 0.63, 0.98]) {
            if (parseTimeFormula(args.gate.param, t, false) === undefined) {
                return 'bad\nformula';
            }
        }
        return undefined;
    } else {
        return 'bad\nvalue';
    }
}

/**
 * @param {!GateCheckArgs} args
 * @returns {undefined|!string}
 */
function badRxxPairFormulaDetector(args) {
    let pairCount = args.innerColumn.gates.filter(g =>
        g !== undefined && g.serializedId === args.gate.serializedId).length;
    if (pairCount === 1) {
        return 'need\nother\nRXX';
    }
    if (pairCount > 2) {
        return 'too\nmany\nRXX';
    }
    return badFormulaDetector(args);
}

/**
 * @param {!Gate} gate
 */
function updateUsingFormula(gate) {
    let stable = parseTimeFormula(gate.param, undefined, false) !== undefined;
    gate._stableDuration = stable ? Infinity : 0;

    if (typeof gate.param === 'string') {
        gate.width = Math.ceil((gate.param.length+1)/5);
        gate.alternate = gate._copy();
        gate.alternate.alternate = gate;
        if (gate.param.startsWith('-(') && gate.param.endsWith(')')) {
            gate.alternate.param = gate.param.substring(2, gate.param.length - 1);
        } else {
            gate.alternate.param = '-(' + gate.param + ')';
        }
    } else {
        gate.width = 1;
        gate.alternate = gate;
    }
}

/**
 * @param {!GateCheckArgs} args
 * @returns {undefined|!string}
 */
function badRxyFormulaDetector(args) {
    if (typeof args.gate.param !== 'string') {
        return 'expected theta, phi';
    }
    for (let t of [0.01, 0.63, 0.98]) {
        if (parseRxyFormula(args.gate.param, t, false) === undefined) {
            return 'bad\nformula';
        }
    }
    return undefined;
}

/**
 * @param {!Gate} gate
 */
function updateUsingRxyFormula(gate) {
    let stable = parseRxyFormula(gate.param, undefined, false) !== undefined;
    gate._stableDuration = stable ? Infinity : 0;

    if (typeof gate.param === 'string') {
        gate.width = Math.max(2, Math.ceil((gate.param.length + 1) / 5));
        gate.alternate = gate._copy();
        gate.alternate.alternate = gate;
        let parts = gate.param.split(',');
        let theta = parts[0].trim();
        let phi = parts.slice(1).join(',').trim();
        if (theta.startsWith('-(') && theta.endsWith(')')) {
            theta = theta.substring(2, theta.length - 1);
        } else {
            theta = '-(' + theta + ')';
        }
        gate.alternate.param = theta + ', ' + phi;
    } else {
        gate.width = 2;
        gate.alternate = gate;
    }
}

/**
 * @param {!string} quantityName
 * @returns {!function(gate: !Gate): !Gate}
 */
function angleClicker(quantityName) {
    return oldGate => {
        let message =
            `Enter a formula to use for the ${quantityName}.\n` +
            "\n" +
            "The formula can depend on the time variable t.\n" +
            "Time t starts at -1, grows to +1 over time, then jumps back to -1.\n" +
            "Invalid results will default to 0.\n" +
            "\n" +
            "Available constants: e, pi\n" +
            "Available functions: cos, sin, acos, asin, tan, atan, ln, sqrt, exp\n" +
            "Available operators: + * / - ^";
        return showPrompt(`Edit ${quantityName} formula`, message, '' + oldGate.param).
            then(txt => txt === null || txt.trim() === '' ? oldGate : oldGate.withParam(txt));
    };
}

function rxyClicker(oldGate) {
    let message =
        "Enter two formulas for RXY, separated by a comma: theta, phi.\n" +
        "\n" +
        "theta is the rotation angle in radians. phi selects the axis in the XY plane, " +
        "measured from +X toward +Y. Both formulas can depend on time t.\n" +
        "\n" +
        "Available constants: e, pi\n" +
        "Available functions: cos, sin, acos, asin, tan, atan, ln, sqrt, exp\n" +
        "Available operators: + * / - ^";
    return showPrompt('Edit RXY formula', message, '' + oldGate.param).
        then(txt => txt === null || txt.trim() === '' ? oldGate : oldGate.withParam(txt));
}

/**
 * Creates the common fixed-angle sixth-turn rotations while keeping their
 * serialized ids explicit and stable for saved circuits.
 *
 * @param {!string} axis
 * @param {!string} symbol
 * @param {!string} serializedId
 * @param {!number} fraction
 * @returns {!Gate}
 */
function fixedSixthTurnGate(axis, symbol, serializedId, fraction) {
    let vector = {x: 0, y: 0, z: 0};
    vector[axis] = fraction / 2 / Math.PI;
    return new GateBuilder().
        setSerializedIdAndSymbol(serializedId).
        setSymbol(symbol).
        setTitle(`${axis.toUpperCase()} rotation by ${fraction > 0 ? 'π/6' : '-π/6'}`).
        setBlurb(`Rotates around the ${axis.toUpperCase()} axis by ${fraction > 0 ? 'π/6' : '-π/6'}.`).
        setKnownEffectToMatrix(Matrix.fromPauliRotation(vector.x, vector.y, vector.z)).
        gate;
}

ParametrizedRotationGates.RX6 = fixedSixthTurnGate('x', 'Rx(π/6)', 'Rx(pi/6)', Math.PI / 6);
ParametrizedRotationGates.RX6i = fixedSixthTurnGate('x', 'Rx(-π/6)', 'Rx(-pi/6)', -Math.PI / 6);
ParametrizedRotationGates.RY6 = fixedSixthTurnGate('y', 'Ry(π/6)', 'Ry(pi/6)', Math.PI / 6);
ParametrizedRotationGates.RY6i = fixedSixthTurnGate('y', 'Ry(-π/6)', 'Ry(-pi/6)', -Math.PI / 6);
ParametrizedRotationGates.RZ6 = fixedSixthTurnGate('z', 'Rz(π/6)', 'Rz(pi/6)', Math.PI / 6);
ParametrizedRotationGates.RZ6i = fixedSixthTurnGate('z', 'Rz(-π/6)', 'Rz(-pi/6)', -Math.PI / 6);

ParametrizedRotationGates.FormulaicRotationRxy = new GateBuilder().
    setSerializedIdAndSymbol("RXYft").
    setSymbol("RXY").
    setTitle("Formula RXY Gate").
    setBlurb("Rotates around an arbitrary axis in the XY plane. θ is the angle in radians and φ selects the axis.").
    setDrawer(rxyDrawer).
    setWidth(2).
    setExtraDisableReasonFinder(badRxyFormulaDetector).
    setOnClickGateFunc(rxyClicker).
    setEffectToTimeVaryingMatrix((t, formula) => {
        let parsed = parseRxyFormula(formula, t*2-1, true);
        return parsed === undefined ? Matrix.identity(2) : rxyMatrix(parsed.theta, parsed.phi);
    }).
    setWithParamPropertyRecomputeFunc(updateUsingRxyFormula).
    promiseEffectIsUnitary().
    gate.withParam('pi/2, 0');

ParametrizedRotationGates.FormulaicRotationRxx = new GateBuilder().
    setSerializedIdAndSymbol("RXXft").
    setSymbol("RXX").
    setTitle("Formula RXX Gate").
    setBlurb("Rotates two qubits around the XX axis by an angle in radians determined by a formula.").
    setDrawer(configurableRotationDrawer('RXX(f(t))', 0, 1)).
    setHeight(2).
    setWidth(2).
    setExtraDisableReasonFinder(badFormulaDetector).
    setOnClickGateFunc(angleClicker("RXX gate's angle in radians")).
    setEffectToTimeVaryingMatrix((t, formula) =>
        rxxMatrix(parseTimeFormula(formula, t*2-1, true) || 0)).
    setWithParamPropertyRecomputeFunc(updateUsingFormula).
    promiseEffectIsUnitary().
    gate.withParam('pi/2');

ParametrizedRotationGates.FormulaicRotationRxxPair = new GateBuilder().
    setSerializedIdAndSymbol("RXXpairft").
    setSymbol("RXX").
    setTitle("Formula RXX Gate [paired]").
    setBlurb("Applies an XX rotation between two wires. Place two RXX gates in the same column; the wires may be non-adjacent.").
    setDrawer(configurableRotationDrawer('RXX(f(t))', 0, 1)).
    setWidth(2).
    setExtraDisableReasonFinder(badRxxPairFormulaDetector).
    setOnClickGateFunc(angleClicker("RXX gate's angle in radians")).
    setEffectToTimeVaryingMatrix((t, formula) =>
        rxxMatrix(parseTimeFormula(formula, t*2-1, true) || 0)).
    setWithParamPropertyRecomputeFunc(updateUsingFormula).
    promiseEffectIsUnitary().
    gate.withParam('pi/2');

ParametrizedRotationGates.FormulaicRotationX = new GateBuilder().
    setSerializedIdAndSymbol("X^ft").
    setTitle("Formula X Rotation").
    setBlurb("Rotates around X by an amount determined by a formula.").
    setDrawer(configurableRotationDrawer('X^f(t)', 0, Math.PI)).
    setWidth(2).
    setExtraDisableReasonFinder(badFormulaDetector).
    setOnClickGateFunc(angleClicker("X gate's exponent")).
    setEffectToTimeVaryingMatrix((t, formula) => {
        let exponent = parseTimeFormula(formula, t*2-1, true) || 0;
        return Matrix.fromPauliRotation(exponent/2, 0, 0);
    }).
    setWithParamPropertyRecomputeFunc(updateUsingFormula).
    promiseEffectIsUnitary().
    gate.withParam('sin(pi t)');

ParametrizedRotationGates.FormulaicRotationY = new GateBuilder().
    setSerializedIdAndSymbol("Y^ft").
    setTitle("Formula Y Rotation").
    setBlurb("Rotates around Y by an amount determined by a formula.").
    setDrawer(configurableRotationDrawer('Y^f(t)', 1, Math.PI)).
    setWidth(2).
    setExtraDisableReasonFinder(badFormulaDetector).
    setOnClickGateFunc(angleClicker("Y gate's exponent")).
    setEffectToTimeVaryingMatrix((t, formula) => {
        let exponent = parseTimeFormula(formula, t*2-1, true) || 0;
        return Matrix.fromPauliRotation(0, exponent/2, 0);
    }).
    setWithParamPropertyRecomputeFunc(updateUsingFormula).
    promiseEffectIsUnitary().
    gate.withParam('sin(pi t)');

ParametrizedRotationGates.FormulaicRotationZ = new GateBuilder().
    setSerializedIdAndSymbol("Z^ft").
    setTitle("Formula Z Rotation").
    setBlurb("Rotates around Z by an amount determined by a formula.").
    setDrawer(configurableRotationDrawer('Z^f(t)', 2, Math.PI)).
    setWidth(2).
    setExtraDisableReasonFinder(badFormulaDetector).
    setOnClickGateFunc(angleClicker("Z gate's exponent")).
    setEffectToTimeVaryingMatrix((t, formula) => {
        let exponent = parseTimeFormula(formula, t*2-1, true) || 0;
        return Matrix.fromPauliRotation(0, 0, exponent/2);
    }).
    setWithParamPropertyRecomputeFunc(updateUsingFormula).
    promiseEffectOnlyPhases().
    gate.withParam('sin(pi t)');

ParametrizedRotationGates.FormulaicRotationRx = new GateBuilder().
    setSerializedIdAndSymbol("Rxft").
    setTitle("Formula Rx Gate").
    setBlurb("Rotates around X by an angle in radians determined by a formula.").
    setDrawer(configurableRotationDrawer('Rx(f(t))', 0, 1)).
    setWidth(2).
    setExtraDisableReasonFinder(badFormulaDetector).
    setOnClickGateFunc(angleClicker("Rx gate's angle in radians")).
    setEffectToTimeVaryingMatrix((t, formula) => XExp((parseTimeFormula(formula, t*2-1, true) || 0) / Math.PI / 4)).
    setWithParamPropertyRecomputeFunc(updateUsingFormula).
    promiseEffectIsUnitary().
    gate.withParam('pi t^2');

ParametrizedRotationGates.FormulaicRotationRy = new GateBuilder().
    setSerializedIdAndSymbol("Ryft").
    setTitle("Formula Ry Gate").
    setBlurb("Rotates around Y by an angle in radians determined by a formula.").
    setDrawer(configurableRotationDrawer('Ry(f(t))', 1, 1)).
    setWidth(2).
    setExtraDisableReasonFinder(badFormulaDetector).
    setOnClickGateFunc(angleClicker("Ry gate's angle in radians")).
    setEffectToTimeVaryingMatrix((t, formula) => YExp((parseTimeFormula(formula, t*2-1, true) || 0) / Math.PI / 4)).
    setWithParamPropertyRecomputeFunc(updateUsingFormula).
    promiseEffectIsUnitary().
    gate.withParam('pi t^2');

ParametrizedRotationGates.FormulaicRotationRz = new GateBuilder().
    setSerializedIdAndSymbol("Rzft").
    setTitle("Formula Rz Gate").
    setBlurb("Rotates around Z by an angle in radians determined by a formula.").
    setDrawer(configurableRotationDrawer('Rz(f(t))', 2, 1)).
    setWidth(2).
    setExtraDisableReasonFinder(badFormulaDetector).
    setOnClickGateFunc(angleClicker("Rz gate's angle in radians")).
    setEffectToTimeVaryingMatrix((t, formula) => ZExp((parseTimeFormula(formula, t*2-1, true) || 0) / Math.PI / 4)).
    setWithParamPropertyRecomputeFunc(updateUsingFormula).
    promiseEffectOnlyPhases().
    gate.withParam('pi t^2');

ParametrizedRotationGates.all =[
    ParametrizedRotationGates.RX6,
    ParametrizedRotationGates.RX6i,
    ParametrizedRotationGates.RY6,
    ParametrizedRotationGates.RY6i,
    ParametrizedRotationGates.RZ6,
    ParametrizedRotationGates.RZ6i,
    ParametrizedRotationGates.XToA,
    ParametrizedRotationGates.XToMinusA,
    ParametrizedRotationGates.YToA,
    ParametrizedRotationGates.YToMinusA,
    ParametrizedRotationGates.ZToA,
    ParametrizedRotationGates.ZToMinusA,
    ParametrizedRotationGates.FormulaicRotationX,
    ParametrizedRotationGates.FormulaicRotationY,
    ParametrizedRotationGates.FormulaicRotationZ,
    ParametrizedRotationGates.FormulaicRotationRx,
    ParametrizedRotationGates.FormulaicRotationRy,
    ParametrizedRotationGates.FormulaicRotationRz,
    ParametrizedRotationGates.FormulaicRotationRxy,
    ParametrizedRotationGates.FormulaicRotationRxx,
    ParametrizedRotationGates.FormulaicRotationRxxPair,
];

export {ParametrizedRotationGates}
