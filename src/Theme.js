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
 * Semantic canvas palettes. Keep state colors warm and distinct from the
 * graphite application chrome so the dark theme does not fall into the usual
 * green/cyan dashboard look.
 */
const Theme = {
    light: Object.freeze({
        GATE_FILL_COLOR: '#FFFFFF',
        HIGHLIGHTED_GATE_FILL_COLOR: '#E8D5C7',
        TIME_DEPENDENT_HIGHLIGHT_COLOR: '#F3E2C1',
        DISPLAY_GATE_IN_TOOLBOX_FILL_COLOR: '#F1DBD7',
        DISPLAY_GATE_BACK_COLOR: '#F8E9E5',
        DISPLAY_GATE_FORE_COLOR: '#8B3F35',
        OPERATION_BACK_COLOR: '#FFF6D7',
        OPERATION_FORE_COLOR: '#C88700',
        SUPERPOSITION_BACK_COLOR: '#F1E4F0',
        SUPERPOSITION_MID_COLOR: '#B888B1',
        SUPERPOSITION_FORE_COLOR: '#6E376B',
        BACKGROUND_COLOR: '#F7F8FA',
        BACKGROUND_COLOR_CIRCUIT: '#FBFCFD',
        CIRCUIT_GRID_COLOR: 'rgba(48, 54, 64, 0.08)',
        CIRCUIT_GUTTER_COLOR: '#EEF0F3',
        CIRCUIT_LANE_COLOR: 'rgba(48, 54, 64, 0.025)',
        CIRCUIT_BORDER_COLOR: '#D7DBE1',
        CIRCUIT_LABEL_COLOR: '#8A919B',
        CIRCUIT_HEADER_COLOR: '#687381',
        CIRCUIT_EMPTY_CARD_COLOR: '#FFFFFF',
        CIRCUIT_EMPTY_CARD_BORDER_COLOR: '#D7DBE1',
        CIRCUIT_ACCENT_COLOR: '#A9460C',
        BACKGROUND_COLOR_TOOLBOX: '#E6E8EC',
        TOOLBOX_DIVIDER_COLOR: '#CDD2DA',
        TOOLBOX_GROUP_FILL_COLOR: '#F7F8FA',
        TOOLBOX_GROUP_BORDER_COLOR: '#D7DBE1',
        TOOLBOX_LABEL_COLOR: '#687381',
        GATE_BORDER_COLOR: '#AAB3BF',
        GATE_SHADOW_COLOR: 'rgba(31, 41, 55, 0.16)',
        DEFAULT_FILL_COLOR: '#FFFFFF',
        DEFAULT_STROKE_COLOR: '#252A32',
        DEFAULT_TEXT_COLOR: '#252A32',
        TOOLTIP_BACKGROUND_COLOR: '#FFFFFF',
        TOOLTIP_BORDER_COLOR: '#D7DBE1',
        TOOLTIP_TITLE_COLOR: '#A9460C',
        TOOLTIP_TEXT_COLOR: '#252A32',
    }),
    dark: Object.freeze({
        GATE_FILL_COLOR: '#303238',
        HIGHLIGHTED_GATE_FILL_COLOR: '#684427',
        TIME_DEPENDENT_HIGHLIGHT_COLOR: '#63502E',
        DISPLAY_GATE_IN_TOOLBOX_FILL_COLOR: '#51343F',
        DISPLAY_GATE_BACK_COLOR: '#4A303A',
        DISPLAY_GATE_FORE_COLOR: '#F0B4B1',
        OPERATION_BACK_COLOR: '#4B3B1A',
        OPERATION_FORE_COLOR: '#FFD477',
        SUPERPOSITION_BACK_COLOR: '#49354A',
        SUPERPOSITION_MID_COLOR: '#8A5E84',
        SUPERPOSITION_FORE_COLOR: '#E8C1DE',
        BACKGROUND_COLOR: '#171A1F',
        BACKGROUND_COLOR_CIRCUIT: '#1B2026',
        CIRCUIT_GRID_COLOR: 'rgba(255, 255, 255, 0.08)',
        CIRCUIT_GUTTER_COLOR: '#222830',
        CIRCUIT_LANE_COLOR: 'rgba(255, 255, 255, 0.025)',
        CIRCUIT_BORDER_COLOR: '#46515E',
        CIRCUIT_LABEL_COLOR: '#C5CCD5',
        CIRCUIT_HEADER_COLOR: '#E2E6EA',
        CIRCUIT_EMPTY_CARD_COLOR: '#252A32',
        CIRCUIT_EMPTY_CARD_BORDER_COLOR: '#56616F',
        CIRCUIT_ACCENT_COLOR: '#C15A1A',
        BACKGROUND_COLOR_TOOLBOX: '#24282E',
        TOOLBOX_DIVIDER_COLOR: '#3C444E',
        TOOLBOX_GROUP_FILL_COLOR: '#292E35',
        TOOLBOX_GROUP_BORDER_COLOR: '#46505B',
        TOOLBOX_LABEL_COLOR: '#E0E4E8',
        GATE_BORDER_COLOR: '#8D99A8',
        GATE_SHADOW_COLOR: 'rgba(0, 0, 0, 0.32)',
        DEFAULT_FILL_COLOR: '#303238',
        DEFAULT_STROKE_COLOR: '#E5E7EB',
        DEFAULT_TEXT_COLOR: '#E5E7EB',
        TOOLTIP_BACKGROUND_COLOR: '#252A32',
        TOOLTIP_BORDER_COLOR: '#56616F',
        TOOLTIP_TITLE_COLOR: '#E29A54',
        TOOLTIP_TEXT_COLOR: '#E5E7EB',
    }),
};

export {Theme};
