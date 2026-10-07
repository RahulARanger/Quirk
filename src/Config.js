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

/**
 * Configuration parameters for quantum circuit visualizer.
 */
class Config {}

Config.EMPTY_CIRCUIT_TITLE = 'Quirk: Quantum Circuit Simulator';

// Each qubit (when actually used) doubles the cost of simulating each gate applied to the circuit.
// Also each qubit tends to increase the amount of accuracy required.
// I see obvious errors when I set this to 20, and things get pretty laggy past 16.
// Beware setting it too high.
Config.MAX_WIRE_COUNT = 16;
Config.SIMPLE_SUPERPOSITION_DRAWING_WIRE_THRESHOLD = 14;

Config.MIN_WIRE_COUNT = 2;
Config.MIN_COL_COUNT = 5;
Config.URL_CIRCUIT_PARAM_KEY = 'circuit';

// Gate background colors.
Config.GATE_FILL_COLOR = '#FFFFFF';
Config.HIGHLIGHTED_GATE_FILL_COLOR = '#C7D9FF';
Config.TIME_DEPENDENT_HIGHLIGHT_COLOR = '#FFF1C7';

// Mixed-state displays are green.
Config.DISPLAY_GATE_IN_TOOLBOX_FILL_COLOR = '#BCE8D0';
Config.DISPLAY_GATE_BACK_COLOR = '#E5F7EC';
Config.DISPLAY_GATE_FORE_COLOR = '#18794E';

// Changes are yellow.
Config.OPERATION_BACK_COLOR = '#FFF6D7';
Config.OPERATION_FORE_COLOR = '#C88700';

// Pure-state displays are cyan.
Config.SUPERPOSITION_BACK_COLOR = '#E6F5F7';
Config.SUPERPOSITION_MID_COLOR = '#9ADDE2';
Config.SUPERPOSITION_FORE_COLOR = '#16727A';

// Time constants.
Config.CYCLE_DURATION_MS = 8000; // How long it takes for evolving gates to cycle, in milliseconds.
Config.TIME_CACHE_GRANULARITY = 196; // The number of buckets the cycle is divided into.
Config.REDRAW_COOLDOWN_MILLIS = 10; // Milliseconds. Rate-limit on redraws. Long draws pad this limit.

/** Half of the span of a drawn gate, width-wise and height-wise.
* @type {!number} */
Config.GATE_RADIUS = 21;
Config.WIRE_SPACING = 56;

Config.BACKGROUND_COLOR = '#F7F8FA';
Config.BACKGROUND_COLOR_CIRCUIT = '#FBFCFD';
Config.CIRCUIT_GRID_COLOR = 'rgba(48, 54, 64, 0.07)';
Config.CIRCUIT_GRID_SPACING = 28;
Config.CIRCUIT_GUTTER_COLOR = '#EEF0F3';
Config.CIRCUIT_LANE_COLOR = 'rgba(48, 54, 64, 0.025)';
Config.CIRCUIT_BORDER_COLOR = '#D7DBE1';
Config.CIRCUIT_LABEL_COLOR = '#5B6572';
Config.CIRCUIT_HEADER_COLOR = '#4C5663';
Config.CIRCUIT_EMPTY_CARD_COLOR = '#FFFFFF';
Config.CIRCUIT_EMPTY_CARD_BORDER_COLOR = '#D7DBE1';
Config.CIRCUIT_ACCENT_COLOR = '#F59E0B';

// Toolbox layout.
Config.BACKGROUND_COLOR_TOOLBOX = '#E6E8EC';
Config.TOOLBOX_DIVIDER_COLOR = '#CDD2DA';
Config.TOOLBOX_GROUP_FILL_COLOR = '#F7F8FA';
Config.TOOLBOX_GROUP_BORDER_COLOR = '#D7DBE1';
Config.TOOLBOX_LABEL_COLOR = '#52606D';
Config.GATE_BORDER_COLOR = '#AAB3BF';
Config.GATE_SHADOW_COLOR = 'rgba(31, 41, 55, 0.16)';
Config.TOOLBOX_GATE_X_SPACING = 5;
Config.TOOLBOX_GATE_Y_SPACING = 4;
Config.TOOLBOX_GATE_X_SPAN = Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_X_SPACING;
Config.TOOLBOX_GATE_Y_SPAN = Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_Y_SPACING;
Config.TOOLBOX_GROUP_SPACING = 16;
Config.TOOLBOX_GROUP_SPAN = Config.TOOLBOX_GATE_X_SPAN * 2 + Config.TOOLBOX_GROUP_SPACING;
Config.TOOLBOX_MARGIN_X = 35;
Config.TOOLBOX_MARGIN_Y = 18;

/**
 * Some tooltips end up looking terrible without available vertical space.
 * (e.g. the error box might not fit, or the gate tips might get squashed)
 * @type {number}
 */
Config.MINIMUM_CANVAS_HEIGHT = 400;
Config.CIRCUIT_BOTTOM_PADDING = 110;

Config.SUPPRESSED_GLSL_WARNING_PATTERNS = [];

// Draw constants.
Config.DEFAULT_FILL_COLOR = '#FFFFFF';
Config.DEFAULT_STROKE_COLOR = '#252A32';
Config.DEFAULT_TEXT_COLOR = '#252A32';
Config.TOOLTIP_BACKGROUND_COLOR = '#FFFFFF';
Config.TOOLTIP_BORDER_COLOR = '#D7DBE1';
Config.TOOLTIP_TITLE_COLOR = '#B54708';
Config.TOOLTIP_TEXT_COLOR = '#252A32';
Config.DEFAULT_FONT_SIZE = 12;
Config.DEFAULT_FONT_FAMILY = 'sans-serif';
Config.DEFAULT_STROKE_THICKNESS = 1;

Config.ACTIVE_THEME = 'light';

/**
 * Updates the canvas palette along with the surrounding HTML theme.
 *
 * @param {!string} theme
 */
Config.applyTheme = theme => {
    Config.ACTIVE_THEME = theme === 'dark' ? 'dark' : 'light';
    if (Config.ACTIVE_THEME === 'dark') {
        Config.GATE_FILL_COLOR = '#303640';
        Config.HIGHLIGHTED_GATE_FILL_COLOR = '#6E4D1A';
        Config.TIME_DEPENDENT_HIGHLIGHT_COLOR = '#6E5D31';
        Config.DISPLAY_GATE_IN_TOOLBOX_FILL_COLOR = '#1B4A39';
        Config.DISPLAY_GATE_BACK_COLOR = '#244C3B';
        Config.DISPLAY_GATE_FORE_COLOR = '#A7E6C1';
        Config.OPERATION_BACK_COLOR = '#4B3B1A';
        Config.OPERATION_FORE_COLOR = '#FFD477';
        Config.SUPERPOSITION_BACK_COLOR = '#163E45';
        Config.SUPERPOSITION_MID_COLOR = '#2C8490';
        Config.SUPERPOSITION_FORE_COLOR = '#A9EEF2';
        Config.BACKGROUND_COLOR = '#171A1F';
        Config.BACKGROUND_COLOR_CIRCUIT = '#1B2026';
        Config.CIRCUIT_GRID_COLOR = 'rgba(255, 255, 255, 0.08)';
        Config.CIRCUIT_GUTTER_COLOR = '#222830';
        Config.CIRCUIT_LANE_COLOR = 'rgba(255, 255, 255, 0.025)';
        Config.CIRCUIT_BORDER_COLOR = '#46515E';
        Config.CIRCUIT_LABEL_COLOR = '#C5CCD5';
        Config.CIRCUIT_HEADER_COLOR = '#E2E6EA';
        Config.CIRCUIT_EMPTY_CARD_COLOR = '#252A32';
        Config.CIRCUIT_EMPTY_CARD_BORDER_COLOR = '#56616F';
        Config.CIRCUIT_ACCENT_COLOR = '#FDBA4A';
        Config.BACKGROUND_COLOR_TOOLBOX = '#262C34';
        Config.TOOLBOX_DIVIDER_COLOR = '#3B434F';
        Config.TOOLBOX_GROUP_FILL_COLOR = '#20262D';
        Config.TOOLBOX_GROUP_BORDER_COLOR = '#46515E';
        Config.TOOLBOX_LABEL_COLOR = '#D5DAE1';
        Config.GATE_BORDER_COLOR = '#8D99A8';
        Config.GATE_SHADOW_COLOR = 'rgba(0, 0, 0, 0.32)';
        Config.DEFAULT_FILL_COLOR = '#303640';
        Config.DEFAULT_STROKE_COLOR = '#E5E7EB';
        Config.DEFAULT_TEXT_COLOR = '#E5E7EB';
        Config.TOOLTIP_BACKGROUND_COLOR = '#252A32';
        Config.TOOLTIP_BORDER_COLOR = '#56616F';
        Config.TOOLTIP_TITLE_COLOR = '#FDBA4A';
        Config.TOOLTIP_TEXT_COLOR = '#E5E7EB';
    } else {
        Config.GATE_FILL_COLOR = '#FFFFFF';
        Config.HIGHLIGHTED_GATE_FILL_COLOR = '#C7D9FF';
        Config.TIME_DEPENDENT_HIGHLIGHT_COLOR = '#FFF1C7';
        Config.DISPLAY_GATE_IN_TOOLBOX_FILL_COLOR = '#BCE8D0';
        Config.DISPLAY_GATE_BACK_COLOR = '#E5F7EC';
        Config.DISPLAY_GATE_FORE_COLOR = '#18794E';
        Config.OPERATION_BACK_COLOR = '#FFF6D7';
        Config.OPERATION_FORE_COLOR = '#C88700';
        Config.SUPERPOSITION_BACK_COLOR = '#E6F5F7';
        Config.SUPERPOSITION_MID_COLOR = '#9ADDE2';
        Config.SUPERPOSITION_FORE_COLOR = '#16727A';
        Config.BACKGROUND_COLOR = '#F7F8FA';
        Config.BACKGROUND_COLOR_CIRCUIT = '#FBFCFD';
        Config.CIRCUIT_GRID_COLOR = 'rgba(48, 54, 64, 0.07)';
        Config.CIRCUIT_GUTTER_COLOR = '#EEF0F3';
        Config.CIRCUIT_LANE_COLOR = 'rgba(48, 54, 64, 0.025)';
        Config.CIRCUIT_BORDER_COLOR = '#D7DBE1';
        Config.CIRCUIT_LABEL_COLOR = '#8A919B';
        Config.CIRCUIT_HEADER_COLOR = '#687381';
        Config.CIRCUIT_EMPTY_CARD_COLOR = '#FFFFFF';
        Config.CIRCUIT_EMPTY_CARD_BORDER_COLOR = '#D7DBE1';
        Config.CIRCUIT_ACCENT_COLOR = '#F59E0B';
        Config.BACKGROUND_COLOR_TOOLBOX = '#E6E8EC';
        Config.TOOLBOX_DIVIDER_COLOR = '#CDD2DA';
        Config.TOOLBOX_GROUP_FILL_COLOR = '#F7F8FA';
        Config.TOOLBOX_GROUP_BORDER_COLOR = '#D7DBE1';
        Config.TOOLBOX_LABEL_COLOR = '#687381';
        Config.GATE_BORDER_COLOR = '#AAB3BF';
        Config.GATE_SHADOW_COLOR = 'rgba(31, 41, 55, 0.16)';
        Config.DEFAULT_FILL_COLOR = '#FFFFFF';
        Config.DEFAULT_STROKE_COLOR = '#252A32';
        Config.DEFAULT_TEXT_COLOR = '#252A32';
        Config.TOOLTIP_BACKGROUND_COLOR = '#FFFFFF';
        Config.TOOLTIP_BORDER_COLOR = '#D7DBE1';
        Config.TOOLTIP_TITLE_COLOR = '#B54708';
        Config.TOOLTIP_TEXT_COLOR = '#252A32';
    }
};

// Calling WebGLRenderingContext.getError forces a CPU/GPU sync. It's very expensive.
Config.CHECK_WEB_GL_ERRORS_EVEN_ON_HOT_PATHS = false;
Config.SEMI_STABLE_RANDOM_VALUE_LIFETIME_MILLIS = 300;

Config.IGNORED_WEBGL_INFO_TERMS = [];

export {Config}
